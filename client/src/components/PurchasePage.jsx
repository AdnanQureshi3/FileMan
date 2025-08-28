import React from "react";
import { FileText, Database, Calendar, Clock } from "lucide-react";
import PayButton from "./PayButton";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

const plans = [
  {
    name: "Free",
    price: 0,
    filesizeLimit: 5,
    totalSizeLimit: 50,
    days: 0,
    iconColor: "text-gray-500",
  },
  {
    name: "Premium Basic",
    price: 100,
    filesizeLimit: 25,
    totalSizeLimit: 100,
    days: 30,
    iconColor: "text-blue-500",
  },
  {
    name: "Premium Pro",
    price: 200,
    filesizeLimit: 100,
    totalSizeLimit: 500,
    days: 30,
    iconColor: "text-green-500",
  },
];

function PurchasePage() {
 
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-2">Choose Your Plan</h1>
      <div className="flex gap-4 flex-wrap">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className="flex-1 min-w-[220px] border rounded-lg p-4 shadow-md hover:shadow-xl transition duration-200 flex flex-col gap-3"
          >
            <h2 className="text-lg font-semibold text-center">{plan.name}</h2>
            <p className="text-center text-xl font-bold">
              {plan.price === 0 ? "Free" : `₹${plan.price}/month`}
            </p>

            <ul className="flex flex-col gap-2 text-sm">
              <li className="flex items-center gap-2">
                <FileText className={`w-4 h-4 ${plan.iconColor}`} /> Max file size: {plan.filesizeLimit} MB
              </li>
              <li className="flex items-center gap-2">
                <Database className={`w-4 h-4 ${plan.iconColor}`} /> Total storage: {plan.totalSizeLimit} MB
              </li>
              {plan.days > 0 && (
                <li className="flex items-center gap-2">
                  <Calendar className={`w-4 h-4 ${plan.iconColor}`} /> Validity: {plan.days} days
                </li>
              )}
            </ul>

            {plan.price === 0 ? (
              <button className="mt-auto px-3 py-1 bg-gray-400 text-white rounded text-sm cursor-not-allowed">
                Current Plan
              </button>
            ) : (
              <div className="mt-auto">
                <PayButton disabled={user?.isPremium || user === null}  plan={plan} />
              </div>
            )}
          </div>
        ))}

        {/* "More Plans Coming Soon" block */}
        <div className="flex-1 min-w-[220px] border-2 border-dashed rounded-lg p-4 shadow-md flex items-center justify-center text-center text-gray-500 font-medium hover:shadow-lg transition duration-200">
          <Clock className="w-5 h-5 mr-2 animate-pulse" />
          More Plans Coming Soon...
        </div>
      </div>
    </div>
  );
}

export default PurchasePage;
