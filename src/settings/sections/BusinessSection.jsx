import React from "react";
import { motion } from "framer-motion";
import {
  Pencil,
  Save,
  MapPinned,
  Layers3,
  Clock3,
  ShieldCheck,
} from "lucide-react";
import { SectionBox } from "../layout/SectionBox";
import { SmallCard } from "../cards/SmallCard";
import { EditableDetailItem } from "../cards/EditableDetailItem";

export function BusinessSection({
  editedData,
  handleFieldChange,
  isEditing,
  handleEditClick,
  handleSaveClick,
}) {
  return (
    <SectionBox
      title="Business Details"
      subtitle="Business identity, ownership and contact information."
      action={
        <button
          onClick={() => isEditing ? handleSaveClick() : handleEditClick("business")}
          className="
            flex
            items-center
            gap-3
            rounded-2xl
            bg-sky-500/10
            px-5
            py-3
            text-sm
            font-bold
            text-sky-400
            cursor-pointer
            hover:bg-sky-500/20
            transition-all
          "
        >
          {isEditing ? <Save size={17} /> : <Pencil size={17} />}
          {isEditing ? "Save Changes" : "Edit Details"}
        </button>
      }
    >
      <div className="grid gap-5 xl:grid-cols-2">
        <div
          className={`
            rounded-[28px]
            border
            border-zinc-200
            bg-zinc-50
            p-5
          `}
        >
          <div className="mb-5">
            <h3
              className={`
                text-xl
                font-black
                text-zinc-900
              `}
            >
              Business Information
            </h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <EditableDetailItem
              label="Owner Name"
              value={editedData.userName}
              isEditing={isEditing}
              onChange={handleFieldChange}
              fieldKey="userName"
            />
            <EditableDetailItem
              label="Company Name"
              value={editedData.companyName}
              isEditing={isEditing}
              onChange={handleFieldChange}
              fieldKey="companyName"
            />
            <EditableDetailItem
              label="Business Type"
              value={editedData.businessType}
              isEditing={isEditing}
              onChange={handleFieldChange}
              fieldKey="businessType"
            />
            <EditableDetailItem
              label="Category"
              value={editedData.category}
              isEditing={isEditing}
              onChange={handleFieldChange}
              fieldKey="category"
            />
            <EditableDetailItem
              label="GST Number"
              value={editedData.gstNumber}
              isEditing={isEditing}
              onChange={handleFieldChange}
              fieldKey="gstNumber"
            />
            <EditableDetailItem
              label="Operating Timing"
              value={editedData.operatingTiming}
              isEditing={isEditing}
              onChange={handleFieldChange}
              fieldKey="operatingTiming"
            />
              <EditableDetailItem
              label="Year is Business"
              value={editedData.yearsInBusiness}
              isEditing={isEditing}
              onChange={handleFieldChange}
              fieldKey="yearsInBusiness"
            />
          </div>
        </div>

        <div
          className={`
            rounded-[28px]
            border
            border-zinc-200
            bg-zinc-50
            p-5
          `}
        >
          <div className="mb-5">
            <h3
              className={`
                text-xl
                font-black
                text-zinc-900
              `}
            >
              Contact Details
            </h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <EditableDetailItem
              label="Phone Number"
              value={editedData.phone}
              isEditing={isEditing}
              onChange={handleFieldChange}
              fieldKey="phone"
            />
            <EditableDetailItem
              label="Alternate Number"
              value={editedData.altPhone}
              isEditing={isEditing}
              onChange={handleFieldChange}
              fieldKey="altPhone"
            />
            <EditableDetailItem
              label="Business Email"
              value={editedData.businessEmail}
              isEditing={isEditing}
              onChange={handleFieldChange}
              fieldKey="businessEmail"
            />
            <EditableDetailItem
              label="Location"
              value={editedData.location}
              isEditing={isEditing}
              onChange={handleFieldChange}
              fieldKey="location"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SmallCard title="Coverage Radius" value="60 KM" icon={MapPinned} />
        <SmallCard title="Coverage Areas" value="18" icon={Layers3} />
        <SmallCard title="Delivery Time" value="35 Min" icon={Clock3} />
        <SmallCard title="Business Status" value="Verified" icon={ShieldCheck} />
      </div>
    </SectionBox>
  );
}