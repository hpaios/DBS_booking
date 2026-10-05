import type {
  VercelRequest,
  VercelResponse
} from "@vercel/node";

const BOOKING_DOMAIN =
  "https://booking.dbservice.cz";

const DBS_API =
  "https://dbs.roapp.page";

const LOCATION_ID = 186414;

type BookingSource = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  gclid: string | null;
  fbclid: string | null;
  landing_url: string;
  referrer: string | null;
};

type BookingBody = {
  name: string;
  phone: string;
  email: string;

  vin?: string;
  description?: string;

  employeeId: number;
  serviceId: number;

  dateStart: string;
  dateEnd: string;

  bookingDate?: string;
  bookingTime?: string;

  bookingSource?: BookingSource;
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // ==========================================
  // CORS
  // ==========================================

  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  try {
    const {
      name,
      phone,
      email,
      vin = "",
      description = "",
      employeeId,
      serviceId,
      dateStart,
      dateEnd,
      bookingDate,
      bookingTime,
      bookingSource
    } = req.body as BookingBody;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      !name ||
      !phone ||
      !email ||
      !employeeId ||
      !serviceId ||
      !dateStart ||
      !dateEnd
    ) {
      return res.status(400).json({
        ok: false,
        error: "Missing required booking data"
      });
    }

    // ==========================================
    // 1. FIND CLIENT
    // ==========================================

    const findUrl =
      `${BOOKING_DOMAIN}` +
      `/api/roapp/find-client-by-phone` +
      `?phone=${encodeURIComponent(phone)}`;

    const findResponse =
      await fetch(findUrl);

    if (!findResponse.ok) {
      const error =
        await findResponse.text();

      console.error(
        "FIND CLIENT ERROR:",
        findResponse.status,
        error
      );

      throw new Error(
        "Failed to find client"
      );
    }

    const findData =
      await findResponse.json();

    let clientId =
      findData?.clientId || null;

    let isNewClient = false;

    // ==========================================
    // 2. CREATE CLIENT IF NOT FOUND
    // ==========================================

    if (!clientId) {
      const createResponse =
        await fetch(
          `${BOOKING_DOMAIN}/api/roapp/create-client`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              first_name: name,
              phone,
              email
            })
          }
        );

      if (!createResponse.ok) {
        const error =
          await createResponse.text();

        console.error(
          "CREATE CLIENT ERROR:",
          createResponse.status,
          error
        );

        throw new Error(
          "Failed to create client"
        );
      }

      const createData =
        await createResponse.json();

      clientId =
        createData?.clientId || null;

      isNewClient = true;

      if (!clientId) {
        throw new Error(
          "Client ID missing after creation"
        );
      }
    }

    // ==========================================
    // 3. COMMENT
    // Same idea as current React booking
    // ==========================================

    const clientTypeTag =
      `--- CLIENT_TYPE=${
        isNewClient ? "NEW" : "OLD"
      } ---`;

    const comment = [
      vin
        ? `VIN: ${vin}`
        : null,

      description
        ? `Описание проблемы: ${description}`
        : null,

      clientTypeTag
    ]
      .filter(Boolean)
      .join("\n");

    // ==========================================
    // 4. CREATE APPOINTMENT
    // ==========================================

    const appointmentResponse =
      await fetch(
        `${DBS_API}/api/booking/locations/${LOCATION_ID}/appointment`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json"
          },

          body: JSON.stringify({
            client: {
              name,
              phone,
              email
            },

            vin,

            comment,

            employee_id:
              employeeId,

            service_ids: [
              serviceId
            ],

            date_start:
              dateStart,

            date_end:
              dateEnd,

            email,

            bookingSource:
              bookingSource || {}
          })
        }
      );

    if (!appointmentResponse.ok) {
      const error =
        await appointmentResponse.text();

      console.error(
        "APPOINTMENT ERROR:",
        appointmentResponse.status,
        error
      );

      return res.status(502).json({
        ok: false,
        error:
          "Failed to create appointment"
      });
    }

    const appointment =
      await appointmentResponse.json();

    // ==========================================
    // 5. WHATSAPP CONFIRMATION
    // Failure here MUST NOT fail booking
    // ==========================================

    try {
      if (
        bookingDate &&
        bookingTime
      ) {
        const confirmationResponse =
          await fetch(
            `${BOOKING_DOMAIN}/api/roapp/send-booking-confirmation`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                clientFirstName:
                  name,

                phone,

                bookingDate,

                bookingTime,

                email,

                bookingSource:
                  bookingSource || {}
              })
            }
          );

        if (!confirmationResponse.ok) {
          console.error(
            "BOOKING CONFIRMATION FAILED:",
            confirmationResponse.status,
            await confirmationResponse.text()
          );
        }
      }

    } catch (error) {
      console.error(
        "WHATSAPP CONFIRMATION ERROR:",
        error
      );
    }

    // ==========================================
    // SUCCESS
    // ==========================================

    return res.status(200).json({
      ok: true,
      clientId,
      isNewClient,
      appointment
    });

  } catch (error) {
    console.error(
      "WEBFLOW BOOKING ERROR:",
      error
    );

    return res.status(500).json({
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Booking failed"
    });
  }
}