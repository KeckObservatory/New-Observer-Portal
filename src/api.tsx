// File to handle all API calls and export the data for the Observer Portal

import { useEffect, useState } from "react";
import urls from './urls.json';
import { differenceInCalendarDays } from "date-fns";


/**
 * Returns the current shifted date as YYYY-MM-DD.
 * If before 8am HST (18:00 UTC), returns yesterday's date.
 */
function getShiftedDate() {
  const now = new Date();

  // Hawaii is UTC-10, so 8:00 AM HST = 18:00 UTC
  const hawaiiDayBoundaryUTC = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    18, 0, 0 // 18:00 UTC
  ));

  // If the current time is before 18:00 UTC, use yesterday’s date
  if (now < hawaiiDayBoundaryUTC) {
    hawaiiDayBoundaryUTC.setUTCDate(hawaiiDayBoundaryUTC.getUTCDate() - 1);
  }

  // Format as YYYY-MM-DD in UTC
  return hawaiiDayBoundaryUTC.toISOString().split("T")[0];
}

/**
 * Returns the date six months later from the given start date as YYYY-MM-DD.
 */
function getDateSixMonthsLater(startDateStr: string) {
  const startDate = new Date(startDateStr);
  // Add 6 months
  startDate.setMonth(startDate.getMonth() + 6);

  // Format as YYYY-MM-DD
  return startDate.toISOString().split('T')[0];
}

/**
 * Given current semester, calculates previous X semester names (used in dropdowns).
 */
export function getLastSemesters(current: string, count: number): string[] {
  const match = current.match(/(\d{4})([AB])/);
  if (!match) return [];

  let year = parseInt(match[1]);
  let term = match[2];
  const semesters: string[] = [];

  for (let i = 0; i < count; i++) {
    if (term === "A") {
      term = "B";
      year--;
    } else {
      term = "A";
    }
    semesters.push(`${year}${term}`);
  }
  return semesters;
}

/* Interface for metrics API response */ 
export interface metricsApiResponse {
  udate: string;
  dusk_12deg: string;
  dusk_18deg: string;
  dawn_18deg: string;
  dawn_12deg: string;
  dark: string;
  sunset: string;
  sunrise: string;
  moonRADEC: string;
  moonrise: string;
  moonset: string;
  moonillumination: string;
  moonphase: string;
  moonbrightness: string;
  length: string;
  midpoint: string;
}

/**
 * Fetches time metrics for the current shifted date.
 */
export function metricsApi() {
  const [data, setData] = useState<metricsApiResponse[] | null>(null);

useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current date with shift
        const formattedDate = getShiftedDate();

        // Fetch metrics list
        const timeList = await fetch(urls.METRICS_API + `date=${formattedDate}&column=COLUMN&output=OUTPUT`);
        const timeMetrics: metricsApiResponse[] = await timeList.json();

      setData(timeMetrics);
    } catch (err) {
      //console.error("Error fetching time metrics:", err);
    }
  };
  fetchData();
}, []);
  return data;}

  /**
 * Interface for telescope schedule API response
 */
export interface TelescopeSchedApiResponse {
  Instrument: string;
  State: string;
  TelNr: number;
}

/**
 * Fetches the instrument status for the current shifted date for main page telSchedule.
 */
export function scheduleApi() {
  const [data, setData] = useState<TelescopeSchedApiResponse[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formattedDate = getShiftedDate();

        // Fetch only instrument status
        const response = await fetch(
          `${urls.SCHEDULE_API}/getInstrumentStatus?date=${formattedDate}&numdays=1`
        );
        const result = await response.json();
        const statesMap = result[0]; // instrument status data

        // Map the instruments into a list with name, TelNr, and State
        const instrumentsWithState: TelescopeSchedApiResponse[] = Object.entries(statesMap).map(
          ([instrumentName, instState]: any) => {
            let stateLabel = "Unknown";
            
            // Calculate state based on Available and Scheduled fields
            if (instState) {
              if (instState.Available === 0) {
                stateLabel = "Not Available";
              } else if (instState.Available === 1 && instState.Scheduled === 0) {
                stateLabel = "TDA Ready";
              } else if (instState.Available === 1 && instState.Scheduled === 1) {
                stateLabel = "Scheduled";
              }
            }

            return {
              Instrument: instrumentName,
              TelNr: instState?.TelNr ?? 0,
              State: stateLabel,
            };
          }
        );

        setData(instrumentsWithState);
      } catch (err) {
        //console.error("Error fetching instrument status:", err);
      }
    };

    fetchData();
  }, []);

  return data;
}

/**
 * Interface for user info API response, called in App.tsx
 */
export interface userInfoApiResponse {
  Id: number;
  Title: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  Email: string;
  Affiliation: string;
  WorkArea: string;
  Interests: string;
  Street: string;
  City: string;
  State: string;
  Country: string;
  Zip: string;
  Phone: string;
  URL: string;
  ProfilePictureURL : string;
}

/**
 * Fetches the current user's info.
 */
export function userInfoApi() {
  const [data, setData] = useState<userInfoApiResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Need to include credentials to get cookies
        const userInfo = await fetch(urls.USER_INFO_API, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        console.log(userInfo, 'userinfo in function')
        const user = await userInfo.json();
        console.log(user, 'user in function')

      setData(user);
    } catch (err) {
      //console.error("Error fetching user:", err);
    }
  };

  fetchData();
}, []);
  return data;}

/**
 * Interface for employee night staff API response
 */
export interface nightStaffApiResponse {
  FirstName: string;
  Type: string; // oa, sa
}

/**
 * Interface for constructed combined schedule + night staff.
 */
export interface CombinedSchedule {
  Date: string;
  StartTime: string;
  EndTime: string;
  TelNr: number;
  Principal: string;
  Observers: string;
  Instrument: string; 
  ProjCode: string;
  staff?: nightStaffApiResponse[];
  DaysUntil: number;
}

/**
* Interface for observation schedule API response
*  */
export interface obsScheduleApiResponse {
  Date: string;
  StartTime: string;
  EndTime: string;
  TelNr: number;
  Principal: string;
  Observers: string;
  Instrument: string;
  ProjCode: string;
}

/**
 * Fetches the combined schedule and staff for an observer.
 */
export function useCombinedSchedule(obsid: number) {
  const [data, setData] = useState<(CombinedSchedule & { DaysUntil: number })[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCombined = async () => {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Get the observer’s schedule
        const formattedDate = getShiftedDate();
        const endDate = getDateSixMonthsLater(formattedDate);

        const scheduleRes = await fetch(
          `${urls.SCHEDULE_API}/getScheduleByUser?obsid=${obsid}&startdate=${formattedDate}&enddate=${endDate}`
        );
        if (!scheduleRes.ok) throw new Error("Failed to fetch schedule");
        const schedule: obsScheduleApiResponse[] = await scheduleRes.json();

        // Step 2: For each schedule date, fetch the night staff
        const staffPromises = schedule.map(async (night) => {
          const employeeRes = await fetch(
            `${urls.EMPLOYEE_API}/getNightStaff?date=${night.Date}`
          );
          if (!employeeRes.ok) throw new Error("Failed to fetch night staff");
          const staff: nightStaffApiResponse[] = await employeeRes.json();

          // Calculate days until observation
          const today = new Date();
          const obsDate = new Date(night.Date);
          const DaysUntil = differenceInCalendarDays(obsDate, today);

          return { ...night, staff, DaysUntil };
        });

        const combined = await Promise.all(staffPromises);
        setData(combined);
      } catch (err: any) {
        console.error("Error fetching combined schedule:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCombined();
  }, [obsid]);

  return { data, loading, error };
}

/**
 * Interface for each observing log 
*/
export interface obsLog {
  filename: string;
  title: string;
}

/**
 * getObsLogInfo ApiResponse interface 
 */
export interface obsLogApiResponse {
  logs: obsLog[];
}

/**
 * Fetches observing logs for a given observer and semester.
 */
export function useObsLogApi(obsid: number, semester: string) {
  const [data, setData] = useState<obsLogApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      try {
        const response = await fetch(
          `${urls.PROPOSALS_API}/getObsLogInfo?obsid=${obsid}&semester=${semester}`
        );
        const json = await response.json();
        //console.log("Fetched Obs Logs:", json);
        setData(json);
      } catch (err) {
        console.error(err);
        setData({ logs: [] });
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, [obsid, semester]);

  return { data, loading };
}


/**
 * Fetches the current semester based on the shifted date.
 */
export function getCurrentSemester() {
  const [semester, setSemester] = useState<string>("");

  useEffect(() => {
    async function fetchCurrent() {
      try {
        // get formatted HST date
        const formattedDate = getShiftedDate();
        const res = await fetch(urls.SCHEDULE_API + `/getSemester?date=${formattedDate}`);
        const json = await res.json(); // { semester: "2025B" }
        const current = json.semester;
        setSemester(current);
      } catch (err) {
        //console.error("Failed to get current semester", err);
      }
    }
    fetchCurrent();
  }, []);

  return semester;
}


/**
 * Fetches employee links for a given observer.
 */
export async function getEmployeeLinks(obsid: number): Promise<{ links?: { name: string; url: string }[] }> {
  try {
    const res = await fetch(urls.EMPLOYEE_API + `/getEmployeeLinks?obsid=${obsid}`);
    return await res.json();
  } catch {
    return {};
  }
}

