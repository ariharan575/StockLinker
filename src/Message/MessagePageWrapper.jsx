// MessagePageWrapper.js (Alternative - Override approach)
import React from "react";
import MainLayout from "../Layout/MainLayout";
import MessagePage from "./MessagePage";
import { C } from "../HomePage/common";

export default function MessagePageWrapper() {
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Messages", path: "/messages" },
    { label: "Inbox", isCurrent: true }
  ];

  return (
    <MainLayout 
      activeNav="messages"
      breadcrumbItems={breadcrumbItems}
      showBreadcrumb={true}
      contentPadding="px-0 py-4" // Remove all padding
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
          padding: "8px 1px",
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