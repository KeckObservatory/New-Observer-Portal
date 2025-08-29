import { useEffect, useState } from "react";
import urls from './urls.json';

// type to send to main content, not what is recieved from api
export interface ApiResponse {
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

export function metricsApi() {
  const [data, setData] = useState<metricsApiResponse[] | null>(null);

useEffect(() => {
    const fetchData = async () => {
      try {
        // get current date
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0]; //TODO: ut or HST date?

        // fetch instrument list
        const timeList = await fetch(urls.TIME_METRICS_API + `date=${formattedDate}&column=COLUMN&output=OUTPUT`);
        console.log('date:',formattedDate)
        const timeMetrics: metricsApiResponse[] = await timeList.json();

        console.log(timeMetrics)

      setData(timeMetrics);
    } catch (err) {
      console.error("Error fetching time metrics:", err);
    }
  };

  fetchData();
}, []);
  // CANNOT FORGET THIS LINE !!!!!!!!! RETURN AT END 
  return data;}

export function scheduleApi() {
  const [data, setData] = useState<ApiResponse[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // get current date
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];

        // fetch instrument list
        const instrumentList = await fetch(urls.SCHEDULE_API + "/getActiveInstruments");
        const instruments: ApiResponse[] = await instrumentList.json();

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
  // CANNOT FORGET THIS LINE !!!!!!!!! RETURN AT END 
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
        const userInfo = await fetch(urls.USER_INFO_API)
        console.log(userInfo)
        const user = await userInfo.json();
        // const statesMa[0]

      setData(user);
    } catch (err) {
      console.error("Error fetching instruments:", err);
    }
  };

  fetchData();
}, []);
  // CANNOT FORGET THIS LINE !!!!!!!!! RETURN AT END 
  return data;}