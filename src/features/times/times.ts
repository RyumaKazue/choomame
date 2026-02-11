import { Time, TimesBucket, timeUnitOrder, convertTimesToBucket, initialTimesStorage } from "./timesSchema";
import { getBucket } from "@extend-chrome/storage";

const timesBucket = getBucket<TimesBucket>("times");

export async function timesOnInstalled() {
  const bucket = await timesBucket.get();
  if (Object.keys(bucket).length === 0) {
    await timesBucket.set(convertTimesToBucket(initialTimesStorage));
  }
}

export const sort_times = (a: Time, b: Time): number =>{
    const a_order = timeUnitOrder[a.unit];
    const b_order = timeUnitOrder[b.unit];

    if(b_order > a_order){
        return -1;
    }else if(a_order > b_order){
        return 1;
    }

    if(b.number > a.number){
        return -1;
    }

    return 1;

}

export const getTimes = async (): Promise<TimesBucket> => {
    const bucket = await timesBucket.get();
    return bucket;
};