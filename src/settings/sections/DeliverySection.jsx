import React from "react";
import { Pencil, Save } from "lucide-react";
import { SectionBox } from "../layout/SectionBox";
import { EditableDetailItem } from "../cards/EditableDetailItem";

export function DeliverySection({
  editedData,
  handleFieldChange,
  isEditing,
  handleEditClick,
  handleSaveClick,
}) {
  return (
    <SectionBox
      title="Store & Delivery"
      subtitle="Store address, delivery coverage and logistics configuration."
      action={
        <button
          onClick={() => isEditing ? handleSaveClick() : handleEditClick("delivery")}
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
          {isEditing ? "Save Changes" : "Edit Address"}
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
          <h3
            className={`
              mb-5
              text-xl
              font-black
              text-zinc-900
            `}
          >
            Store Address Details
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <EditableDetailItem
              label="Address Line 1"
              value={editedData.addressLine1}
              isEditing={isEditing}
              onChange={handleFieldChange}
              fieldKey="addressLine1"
            />
            <EditableDetailItem
              label="Address Line 2"
              value={editedData.addressLine2}
              isEditing={isEditing}
              onChange={handleFieldChange}
              fieldKey="addressLine2"
            />
            <EditableDetailItem
              label="City"
              value={editedData.city}
              isEditing={isEditing}
              onChange={handleFieldChange}
              fieldKey="city"
            />
            <EditableDetailItem
              label="District"
              value={editedData.district}
              isEditing={isEditing}
              onChange={handleFieldChange}
              fieldKey="district"
            />
            <EditableDetailItem
              label="Pincode"
              value={editedData.pincode}
              isEditing={isEditing}
              onChange={handleFieldChange}
              fieldKey="pincode"
            />
            <EditableDetailItem
              label="Landmark"
              value={editedData.landmark}
              isEditing={isEditing}
              onChange={handleFieldChange}
              fieldKey="landmark"
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
          <h3
            className={`
              mb-5
              text-xl
              font-black
              text-zinc-900
            `}
          >
            Delivery Configuration
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <EditableDetailItem
              label="Delivery Radius"
              value={editedData.deliveryRadius}
              isEditing={isEditing}
              onChange={handleFieldChange}
              fieldKey="deliveryRadius"
            />
            <EditableDetailItem
              label="Minimum Order"
              value={editedData.minOrder}
              isEditing={isEditing}
              onChange={handleFieldChange}
              fieldKey="minOrder"
            />
            <EditableDetailItem
              label="Delivery Charges"
              value={editedData.deliveryCharges}
              isEditing={isEditing}
              onChange={handleFieldChange}
              fieldKey="deliveryCharges"
            />
            <EditableDetailItem
              label="Fast Delivery"
              value={editedData.fastDelivery}
              isEditing={isEditing}
              onChange={handleFieldChange}
              fieldKey="fastDelivery"
            />
            <EditableDetailItem
              label="Delivery Days"
              value={editedData.deliveryDays}
              isEditing={isEditing}
              onChange={handleFieldChange}
              fieldKey="deliveryDays"
            />
            <EditableDetailItem
              label="Route Schedule"
              value={editedData.routeSchedule}
              isEditing={isEditing}
              onChange={handleFieldChange}
              fieldKey="routeSchedule"
            />
          </div>
        </div>
      </div>
    </SectionBox>
  );
}