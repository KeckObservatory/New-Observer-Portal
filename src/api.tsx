// File to handle all api calls and export the data 

import { useEffect, useState } from "react";
import urls from './urls.json';

// type to send to main content, not what is recieved from api
export interface telescopeSchedApiResponse {
  Instrument: string;
  ScienceLocation: string;
  StorageLocation: string;
  TelNr: number;
  State?: string; // added property for ready state
}

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

// Function to get current shifted date
// if before 8am HST (18:00 UTC) return yesterday's date
// if not, return today's date
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


export function metricsApi() {
  const [data, setData] = useState<metricsApiResponse[] | null>(null);

useEffect(() => {
    const fetchData = async () => {
      try {
        // get current date with shift
        const formattedDate = getShiftedDate();

        // fetch metrics list
        const timeList = await fetch(urls.TIME_METRICS_API + `date=${formattedDate}&column=COLUMN&output=OUTPUT`);
        //console.log('date:',formattedDate)
        const timeMetrics: metricsApiResponse[] = await timeList.json();

        //console.log(timeMetrics)

      setData(timeMetrics);
    } catch (err) {
      console.error("Error fetching time metrics:", err);
    }
  };

  fetchData();
}, []);
  return data;}

export function scheduleApi() {
  const [data, setData] = useState<telescopeSchedApiResponse[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // get current date with shift
        const formattedDate = getShiftedDate();

        // fetch instrument list
        // TODO: Get rid of this api call and only use the one below it
        const instrumentList = await fetch(urls.SCHEDULE_API + "/getActiveInstruments");
        const instruments: telescopeSchedApiResponse[] = await instrumentList.json();

        // fetch state of each instrument (just one call now)
        const instrumentState = await fetch(urls.SCHEDULE_API + `/getInstrumentStatus?date=${formattedDate}&numdays=1`)
        //console.log(instrumentState)
        const states = await instrumentState.json();
        const statesMap = states[0]

        // combine instruments with their state
        // for each instrument name ... like a for loop
        const instrumentsWithState = instruments.map((inst) => {
        const instState = statesMap[inst.Instrument]; // match by instrument name
        //console.log('instState:' , instState)
        let stateLabel = "Unknown";

        // depending on avaliable and if it is scheduleed -> set the state
        if (instState) {
          if (instState.Available === 0) {
            stateLabel = "Not Available";
          } else if (instState.Available === 1 && instState.Scheduled === 0) {
            stateLabel = "TDA Ready";
          } else if (instState.Available === 1 && instState.Scheduled === 1) {
            stateLabel = "Scheduled";
          }
        }
        // create new object, use all filds from inst + add new state
        return { ...inst, State: stateLabel };
      });

      setData(instrumentsWithState);
      //console.log("Final combined data:", instrumentsWithState);
    } catch (err) {
      console.error("Error fetching instruments:", err);
    }
  };

  fetchData();
}, []);
  return data;}

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

export function userInfoApi() {
  const [data, setData] = useState<userInfoApiResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
      console.error("Error fetching user:", err);
    }
  };

  fetchData();
}, []);
  return data;}


export interface ObserverLog {
  Name: string;
  Semester: string;
  Title: string;
}

export interface ObserverLogsApiResponse {
  success: number; 
  data: {
    ObsLogTitle: ObserverLog[];
  };
  msg: string | null;
}
export function observerLogsApi() {
  const [data, setData] = useState<ObserverLogsApiResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const logsResponse = await fetch(urls.DEV_OBSLOGLIST);
        const logsData: ObserverLogsApiResponse = await logsResponse.json();
        console.log(logsData);
        setData(logsData);
      } catch (err) {
        console.error("Error fetching observer logs:", err);
      }
    };

    fetchData();
  }, []);
  return data; }


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


export interface nightStaffApiResponse {
  FirstName: string;
  Type: string; // oa, sa
}


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
}

export function useCombinedSchedule(obsid: number) {
  const [data, setData] = useState<CombinedSchedule[] | null>(null);
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
            `${urls.EMPLOYEE_API_DEV}/getNightStaff?date=${night.Date}`
          );
          if (!employeeRes.ok) throw new Error("Failed to fetch night staff");
          const staff: nightStaffApiResponse[] = await employeeRes.json();
          return { ...night, staff };
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

function getDateSixMonthsLater(startDateStr: string) {
  const startDate = new Date(startDateStr);
  // Add 6 months
  startDate.setMonth(startDate.getMonth() + 6);

  // Format as YYYY-MM-DD
  return startDate.toISOString().split('T')[0];
}

export interface obsLog {
  filename: string;
  title: string;
  // ...other fields
}


export interface obsLogApiResponse {
  logs: obsLog[];
}


export function useObsLogApi(obsid: number, semester: string) {
  const [data, setData] = useState<obsLogApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      try {
        const response = await fetch(
          `${urls.OBS_LOG_DEV}?obsid=${obsid}&semester=${semester}`
        );
        const json = await response.json();
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



export function getCurrentSemester() {
  const [semester, setSemester] = useState<string>("");

  useEffect(() => {
    async function fetchCurrent() {
      try {
        // get formatted HST date
        const formattedDate = getShiftedDate();
        const res = await fetch(urls.DEV_SCHEDULE2 + `/getSemester?date=${formattedDate}`);
        const json = await res.json(); // { semester: "2025B" }
        const current = json.semester;
        console.log(current)
        setSemester(current);
      } catch (err) {
        console.error("Failed to get current semester", err);
      }
    }
    fetchCurrent();
  }, []);

  return semester;
}

export async function getEmployeeLinks(obsid: number): Promise<{ links?: { name: string; url: string }[] }> {
  try {
    const res = await fetch(urls.DEV_EMPLOYEE + `/getEmployeeLinks?obsid=${obsid}`);
    return await res.json();
  } catch {
    return {};
  }
}