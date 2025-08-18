import React, { useEffect, useState } from "react";
import urls from './urls.json';

// type to send to main content, not what is recieved from api
export interface ApiResponse {
  Instrument: string;
  ScienceLocation: string;
  StorageLocation: string;
  TelNr: number;
  State?: string; // added property for ready state
}

export default function scheduleApi() {
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
      console.log("Final combined data:", instrumentsWithState);
    } catch (err) {
      console.error("Error fetching instruments:", err);
    }
  };

  fetchData();
}, []);
  // CANNOT FORGET THIS LINE !!!!!!!!! RETURN AT END 
  return data;}