import React from "react";
import { motion } from "framer-motion";
import {
  User2,
  Building2,
  Phone,
  Mail,
  ShieldCheck,
  MapPin,
  Check,
  CheckCircle2
} from "lucide-react";
import SectionTitle from "./SectionTitle";
import Input from "./Input";
import { STORE_TYPES, DELIVERY_OPTIONS } from "./constants";
import { useNavigate } from "react-router-dom";

// Business Step Component
export function BusinessStep({ formData, updateField }) {

  const navigate = useNavigate();

  return (
    <div>
      <SectionTitle
        title={
          <>
            Tell us about your
            <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text ps-2 text-transparent">
              Business
            </span>
          </>
        }
        subtitle="Create your enterprise profile and continue onboarding."
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="grid md:grid-cols-2 gap-5"
      >
        <Input
          icon={User2}
          label="Owner Name"
          placeholder="Rajesh Kumar"
          value={formData.ownerName}
          onChange={(e) =>
            updateField(
              "ownerName",
              e.target.value
            )
          }
        />

        <Input
          icon={Building2}
          label="Business Name"
          placeholder="Kumar Traders"
          value={formData.businessName}
          onChange={(e) =>
            updateField(
              "businessName",
              e.target.value
            )
          }
        />

        <Input
          icon={Phone}
          label="Mobile Number"
          placeholder="+91 9876543210"
          value={formData.mobile}
          onChange={(e) =>
            updateField(
              "mobile",
              e.target.value
            )
          }
        />

        <Input
          icon={Phone}
          label="Alternate Mobile"
          placeholder="+91 9876543210"
          value={formData.alternateMobile}
          onChange={(e) =>
            updateField(
              "alternateMobile",
              e.target.value
            )
          }
        />

        <Input
          icon={Mail}
          label="Business Email"
          placeholder="business@email.com"
          value={formData.businessEmail}
          onChange={(e) =>
            updateField(
              "businessEmail",
              e.target.value
            )
          }
        />

        <Input
          icon={ShieldCheck}
          label="GST Number"
          placeholder="22AAAA0000AA1Z5"
          value={formData.gstNumber}
          onChange={(e) =>
            updateField(
              "gstNumber",
              e.target.value
            )
          }
        />
      </motion.div>
    </div>
  );
}

// Address Step Component
export function AddressStep({ formData, updateField }) {
  return (
    <div>
      <SectionTitle
        title={
          <>
            Business
            <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 ps-2 text-transparent bg-clip-text">
              Address
            </span>
          </>
        }
        subtitle="Setup your location information."
      />

      <div className="grid md:grid-cols-2 gap-5">
        <Input
          icon={MapPin}
          label="Address Line 1"
          placeholder="No 24 Main Road"
          value={formData.address1}
          onChange={(e) =>
            updateField(
              "address1",
              e.target.value
            )
          }
        />

        <Input
          icon={MapPin}
          label="Address Line 2"
          placeholder="Near Bus Stand"
          value={formData.address2}
          onChange={(e) =>
            updateField(
              "address2",
              e.target.value
            )
          }
        />

        <Input
          icon={MapPin}
          label="City"
          placeholder="Chennai"
          value={formData.city}
          onChange={(e) =>
            updateField(
              "city",
              e.target.value
            )
          }
        />

        <Input
          icon={MapPin}
          label="District"
          placeholder="Thanjavur"
          value={formData.district}
          onChange={(e) =>
            updateField(
              "district",
              e.target.value
            )
          }
        />

        <Input
          icon={MapPin}
          label="State"
          placeholder="Tamil Nadu"
          value={formData.state}
          onChange={(e) =>
            updateField(
              "state",
              e.target.value
            )
          }
        />

        <Input
          icon={MapPin}
          label="Pincode"
          placeholder="613001"
          value={formData.pincode}
          onChange={(e) =>
            updateField(
              "pincode",
              e.target.value
            )
          }
        />
      </div>
    </div>
  );
}

// Marketplace Step Component
export function MarketplaceStep({
  role,
  categories,
  formData,
  toggleCategory,
  updateField,
}) {
  return (
    <div>
      <SectionTitle
        title={
          <>
            Marketplace
            <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 ps-2 text-transparent bg-clip-text">
              Setup
            </span>
          </>
        }
        subtitle="Customize your marketplace profile."
      />

      <div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
          Choose categories
        </h3>

        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((item, index) => {
            const active =
              formData.businessCategories.includes(
                item
              );

            return (
              <motion.button
                key={item}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.04,
                }}
                whileHover={{
                  y: -3,
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                onClick={() =>
                  toggleCategory(item)
                }
                className={`px-4 py-3 rounded-2xl border text-sm font-semibold transition-all duration-300 ${
                  active
                    ? "bg-pink-100 border-pink-300 text-pink-700"
                    : "bg-slate-50 border-slate-200 hover:border-pink-300 text-slate-700"
                }`}
              >
                {item}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
          {role === "WHOLESALER"
            ? "Delivery support"
            : "Store size"}
        </h3>

        <div className="mt-5 grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {(role === "WHOLESALER"
            ? DELIVERY_OPTIONS
            : STORE_TYPES
          ).map((item, index) => {
            const active =
              role === "WHOLESALER"
                ? formData.deliverySupport ===
                  item
                : formData.storeSize === item;

            return (
              <motion.button
                key={item}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.05,
                }}
                whileHover={{
                  y: -5,
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={() =>
                  role === "WHOLESALER"
                    ? updateField(
                        "deliverySupport",
                        item
                      )
                    : updateField(
                        "storeSize",
                        item
                      )
                }
                className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
                  active
                    ? "bg-sky-500 text-white border-transparent shadow-[0_0_30px_rgba(56,189,248,0.35)]"
                    : "bg-slate-50 border-slate-200 hover:border-sky-300 text-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm leading-tight">
                    {item}
                  </h4>

                  {active && (
                    <Check size={16} />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Success Screen Component
export function SuccessScreen() {

  const navigate = useNavigate();
  
  return (
    <div className="min-h-[520px] flex flex-col items-center justify-center text-center relative overflow-hidden">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
        className="absolute w-[300px] h-[300px] rounded-full bg-pink-400/10 blur-3xl"
      />

      <motion.div
        initial={{
          scale: 0,
          rotate: -180,
        }}
        animate={{
          scale: 1,
          rotate: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 120,
        }}
        className="relative z-10 w-28 h-28 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.35)]"
      >
        <CheckCircle2 className="w-14 h-14 text-white" />
      </motion.div>

      <motion.h2
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.2,
        }}
        className="mt-8 text-[38px] sm:text-[58px] leading-[1] font-black tracking-tight text-slate-900"
      >
        Marketplace
        <br />

        <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">
          ready 🚀
        </span>
      </motion.h2>

      <motion.p
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.3,
        }}
        className="mt-5 max-w-xl text-sm sm:text-base leading-7 text-slate-600"
      >
        Your onboarding has been completed
        successfully.
      </motion.p>

      <motion.button
        whileHover={{
          scale: 1.03,
        }}
        whileTap={{
          scale: 0.98,
        }}
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.4,
        }}
        className="mt-10 h-16 px-15 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 text-white font-black text-lg shadow-[0_20px_60px_rgba(236,72,153,0.35)]"
          
      >
       <span onClick={(()=> navigate("/dash"))}> Launch Dashboard →</span>
      </motion.button>
    </div>
  );
}