// unitに入る値
export type TimesUnit = 
| "Any"
| "year"
| "month"
| "week"
| "day"
| "hour"
| "minute";

//　Time型
export type Time = {
    timeId: string;
    unit: TimesUnit;
    number: number;
}

// chrome.storageに保存する形
export type TimesBucket = Record<string, Time>;

// unitの順序付け
export const timeUnitOrder: Record<TimesUnit, number> = {
  Any: 0, // Any
  year: 1, // year
  month: 2, // month
  week: 3, // week
  day: 4, // day
  hour: 5, // hour
  minute: 6, // minute
};

// Time[]をTimesBucketに変換する関数
export function convertTimesToBucket(times: Time[]): TimesBucket {
    let bucket: TimesBucket = {};

    for( const time of times ){
        bucket[time.timeId] = time;
    } 

    return bucket;
}

export const initialTimesStorage: Time[] = [
  {
    timeId: "Any",
    unit: "Any",
    number: 0,
  },
  {
    timeId: "y3",
    unit: "year",
    number: 3,
  },
  {
    timeId: "y1",
    unit: "year",
    number: 1,
  },
  {
    timeId: "m6",
    unit: "month",
    number: 6,
  },
  {
    timeId: "m1",
    unit: "month",
    number: 1,
  },
  {
    timeId: "w1",
    unit: "week",
    number: 1,
  },
  {
    timeId: "d1",
    unit: "day",
    number: 1,
  },
];