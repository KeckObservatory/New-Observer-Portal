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
  Id: string;
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
}

export function userInfoApi() {
  const [data, setData] = useState<userInfoApiResponse[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = await fetch(urls.USER_INFO_API_DEV)
        //console.log(userInfo)
        const user = await userInfo.json();
        //console.log(user)
        // const statesMa[0]

      setData(user);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  fetchData();
}, []);
  return data;}


export const placeholderUser = {
  Id: "6679",
  FirstName: "Jane",
  MiddleName: "",
  LastName: "Doe",
  Title: "Astronomer",
  Email: "jane.doe@example.com",
  Affiliation: "Keck Observatory",
  WorkArea: "Instrumentation",
  Interests: "Exoplanets, Spectroscopy",
  Street: "123 Observatory Rd",
  City: "Waimea",
  State: "HI",
  Zip: "96743",
  Country: "USA",
  Phone: "(808) 555-1234",
  URL: "https://www.example.com",
  };


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
  // OA
  // SA
  ProjCode: string;
  // Observing request 
  // POC form

}


export function obsScheduleApi(obsid: number) { 
  const [data, setData] = useState<obsScheduleApiResponse[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // get current date with shift
        const formattedDate = getShiftedDate();
        const endDate = getDateSixMonthsLater(formattedDate);

        console.log('start:', formattedDate);
        console.log('end:', endDate);

        // fetch future observing dates for obsid
        const observing_schedule = await fetch(urls.SCHEDULE_API + `/getScheduleByUser?obsid=${obsid}&startdate=${formattedDate}&enddate=${endDate}`);
        //console.log(userInfo)
        const obs_schedule = await observing_schedule.json();
        console.log("schedule:", obs_schedule)

      setData(obs_schedule);
    } catch (err) {
      console.error("Error fetching observing schedule:", err);
    }
  };

  fetchData();
}, []);
  return data;}

  function getDateSixMonthsLater(startDateStr: string) {
  const startDate = new Date(startDateStr);
  // Add 6 months
  startDate.setMonth(startDate.getMonth() + 6);

  // Handle month overflow (e.g., adding 6 months to August 31)
  // JS Date will auto-correct to the next month if the day doesn't exist
  // If you want to always land on the last day of the month if overflow, you can add extra logic

  // Format as YYYY-MM-DD
  return startDate.toISOString().split('T')[0];
}