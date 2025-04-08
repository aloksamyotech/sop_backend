import BankRowData from "../models/BankRowData.js";
import cron from "node-cron";
import getAccessToken, { getAllData } from "../core/common/helper.js";
import moment from "moment-timezone";
import Logger from "../core/common/logger.js";

let activeCronJobs = [];

export async function CronJob() {
    try {
        console.log("Starting CronJob setup...");

        // Stop existing cron jobs if any
        if (activeCronJobs.length > 0) {
            console.log("Stopping existing cron jobs...");
            activeCronJobs.forEach((job) => job.stop());
            activeCronJobs = [];
        }

        // Define timezone mappings
        const dialCodeToTimezone = {
            "+1": "America/New_York",
            "+44": "Europe/London",
            "+91": "Asia/Kolkata",
            "+46": "Europe/Stockholm",
            "+47": "Europe/Oslo",
            "+45": "Europe/Copenhagen",
        };

        // Fetch user-related bank data
        console.log("Fetching bank row data with user details...");
        const bankRowData = await BankRowData.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            { $unwind: "$userDetails" },
            {
                $project: {
                    _id: 1,
                    user_id: 1,
                    id: 1,
                    country_code: "$userDetails.country_code",
                },
            },
        ]);

        console.log("Bank row data fetched:", bankRowData.length, "records");

        if (!bankRowData || bankRowData.length === 0) {
            console.log("No bank row data found to schedule jobs");
            return [];
        }

        const cronExpression = `*/5 * * * *`; 
        console.log(`Scheduling cron job with expression: ${cronExpression}`);

        const job = cron.schedule(
            cronExpression,
            async () => {
                console.log("Cron job triggered");

                try {
                    console.log("Requesting access token...");
                    const tokenResponse = await getAccessToken();

                    if (!tokenResponse.status) {
                        console.log("Failed to get access token:", tokenResponse.error);
                        return;
                    }

                    console.log("Access token received:", tokenResponse.accessToken);

                    // Optional delay (non-blocking) — if you still want to keep it:
                    (async () => {
                        console.log("Waiting 60 seconds non-blocking inside cron job...");
                        await new Promise(res => setTimeout(res, 60 * 1000));
                        console.log("60 seconds delay done.");
                    })();

                    const accessToken = tokenResponse.accessToken;

                    for (const user of bankRowData) {
                        console.log(`Fetching data for user ID: ${user.user_id}, Kreditz ID: ${user.id}`);
                        await getAllData(user.id, accessToken);
                    }
                } catch (error) {
                    console.error("Error in cron job execution:", error);
                }
            },
            {
                timezone: 'Europe/Oslo',
            }
        );

        activeCronJobs.push(job);
        console.log("Cron job scheduled and pushed to active jobs");

        return activeCronJobs;
    } catch (error) {
        console.error("Error while setting up CronJob:", error);
        return [];
    }
}

export function stopAllJobs() {
    console.log("Stopping all cron jobs...");
    activeCronJobs.forEach((job) => job.stop());
    activeCronJobs = [];
    Logger.info("All cron jobs stopped");
    console.log("All cron jobs stopped successfully.");
}
