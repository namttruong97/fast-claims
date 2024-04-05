import { TClaim } from "./claim";

export type TApplication = {
  [staffId: string]: {
    personalClaims: TClaim[];
    manageClaims?: TClaim[];
  };
};
