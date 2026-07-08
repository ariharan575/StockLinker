import React from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { SectionBox } from "../layout/SectionBox";
import { DetailItem } from "../cards/DetailItem";

export function TeamSection() {
  const teamMembers = [
    { name: "Ravi Kumar", role: "Delivery Manager", since: "2022" },
    { name: "Vignesh", role: "Inventory Staff", since: "2023" },
    { name: "Hari", role: "Billing Staff", since: "2024" },
    { name: "Priya", role: "Sales Manager", since: "2021" },
    { name: "Suresh", role: "Warehouse Lead", since: "2020" },
    { name: "Meena", role: "Customer Support", since: "2024" },
  ];

  return (
    <SectionBox
      title="Team Details"
      subtitle="Manage staff roles, permissions and employee details."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-h-[600px] overflow-y-auto custom-scroll pr-1">
        {teamMembers.map((item) => (
          <motion.div
            whileHover={{ y: -4 }}
            key={item.name}
            className={`
              rounded-[30px]
              border
              border-zinc-200
              bg-white
              p-5
              shadow-xl
              cursor-pointer
              transition-all
              duration-300
              hover:border-pink-400
              hover:bg-pink-50/60
            `}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-sky-500/10 text-sky-600">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-zinc-900">{item.name}</h3>
                <p className="mt-1 text-sm font-semibold text-sky-400">{item.role}</p>
              </div>
            </div>
            <div className="mt-5 grid gap-4">
              <DetailItem label="Status" value="Active Employee" />
              <DetailItem label="Working Since" value={item.since} />
            </div>
          </motion.div>
        ))}
      </div>
    </SectionBox>
  );
}