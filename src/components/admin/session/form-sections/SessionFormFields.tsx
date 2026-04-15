
import React from "react";
import { Control } from "react-hook-form";
import { SessionFormValues } from "../SessionFormSchema";
import { useCampSettings } from "@/contexts/CampSettingsContext";
import TitleField from "../form-fields/TitleField";
import DescriptionField from "../form-fields/DescriptionField";
import DateField from "../form-fields/DateField";
import LocationField from "../form-fields/LocationField";
import RoomField from "../form-fields/RoomField";
import MaxCampersField from "../form-fields/MaxCampersField";

interface SessionFormFieldsProps {
  control: Control<SessionFormValues>;
}

const SessionFormFields: React.FC<SessionFormFieldsProps> = ({ control }) => {
  const { campStart, campEnd } = useCampSettings();

  return (
    <>
      <TitleField control={control} />
      <DescriptionField control={control} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateField
          control={control}
          min={campStart ? `${campStart}T00:00` : undefined}
          max={campEnd ? `${campEnd}T23:59` : undefined}
        />
        <LocationField control={control} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RoomField control={control} />
        <MaxCampersField control={control} />
      </div>
    </>
  );
};

export default SessionFormFields;
