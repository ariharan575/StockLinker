// MessagePageWrapper.js (Alternative - Override approach)
import React from "react";
import MainLayout from "../../Layout/MainLayout";
import MessagePage from "../pages/Messenger";
import { C } from "../../Layout/common/constants";

export default function MessagePageWrapper() {

  return (
    <MainLayout 
      activeNav="messages"
      contentPadding="px-0" 
      maxWidth="100%" // Full width
      customStyles={{
        overflow: "hidden",
        height: "100vh",
        backgroundColor: C.page,
        margin: 0,
        padding: 0,
        position: "relative"
      }}
    >
      <div 
        className="w-full h-full overflow-hidden"
        style={{
          height: "calc(100vh - 100px)",
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          padding: "5px",
          // On larger screens, add padding
          paddingLeft: "calc(16px + 0rem)",
          paddingRight: "calc(16px + 0rem)",
        }}
      >
        <style>
          {`
            @media (min-width: 768px) {
              .message-padding {
                padding-left: 24px !important;
                padding-right: 24px !important;
              }
            }
            @media (min-width: 1024px) {
              .message-padding {
                padding-left: 32px !important;
                padding-right: 32px !important;
              }
            }
          `}
        </style>
        <div className="message-padding" style={{ 
          height: "100%", 
          width: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column"
        }}>
          <MessagePage />
        </div>
      </div>
    </MainLayout>
  );
}