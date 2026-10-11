export interface Shift {
  id: string;
  employeeId: string;
  shiftName: string;
  startTimeUtc: string;
  endTimeUtc: string;
  isCancelled: boolean;
}

export interface CreateShiftDto {
  employeeId: string;
  shiftName: string;
  startTimeUtc: string;
  endTimeUtc: string;
}

