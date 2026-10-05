import type { VercelRequest, VercelResponse } from "@vercel/node";

const LOCATION_ID = 186414;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // =========================
  // CORS
  // =========================

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed",
    });
  }

  try {
    const {
      type,
      employee_id,
      slot_minutes = "60",
      period_days = "31",
      start_date,
    } = req.query;

    // =========================
    // LOCATION
    // =========================

    if (type === "location") {
      const response = await fetch(
        "https://dbs.roapp.page/api/booking/locations",
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        console.error(
          "LOCATION API ERROR:",
          response.status,
          errorText
        );

        return res.status(response.status).json({
          ok: false,
          error: "Failed to load location",
        });
      }

      const data = await response.json();

      return res.status(200).json(data);
    }

    // =========================
    // TIMESLOTS
    // =========================

    if (type === "timeslots") {
      if (!employee_id) {
        return res.status(400).json({
          ok: false,
          error: "employee_id is required",
        });
      }

      if (!start_date) {
        return res.status(400).json({
          ok: false,
          error: "start_date is required",
        });
      }

      const params = new URLSearchParams({
        employee_id: String(employee_id),
        slot_minutes: String(slot_minutes),
        period_days: String(period_days),
        start_date: String(start_date),
      });

      const url =
        `https://dbs.roapp.page/api/booking/locations/${LOCATION_ID}/timeslots:search?` +
        params.toString();

      console.log("TIMESLOTS →", url);

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();

        console.error(
          "TIMESLOTS API ERROR:",
          response.status,
          errorText
        );

        return res.status(response.status).json({
          ok: false,
          error: "Failed to load timeslots",
        });
      }

      const data = await response.json();

      return res.status(200).json(data);
    }

    // =========================
    // INVALID TYPE
    // =========================

    return res.status(400).json({
      ok: false,
      error: "Invalid type",
    });

  } catch (error) {
    console.error(
      "BOOKING SLOTS PROXY ERROR:",
      error
    );

    return res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
}