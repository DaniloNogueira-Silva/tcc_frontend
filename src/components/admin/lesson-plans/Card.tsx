import "./styles/card.css";

import { BsPencil, BsTrash } from "react-icons/bs";

import { HttpRequest } from "utils/http-request";
import { ILessonPlan } from "app/admin/plans/page";
import { JwtService } from "auth/jwtService";
import Link from "next/link";

interface CardProps {
  lessonPlansData: ILessonPlan[];
}

const themeImages: Record<string, string> = {
  FLOREST: "/img/themes/florest.png",
  CAVERN: "/img/themes/cavern.png",
  DUNGEON: "/img/themes/dungeon.png",
};

const LessonPlanCards = ({ lessonPlansData }: CardProps) => {
  const httpRequest = new HttpRequest();

  const jwtService = new JwtService();
  const isTeacher = jwtService.getUserRole();

  const handleDeletePlan = async (planId: string) => {
    await httpRequest.deleteLessonPlan(planId);

    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {lessonPlansData.map((plan) => (
        <div
          key={plan._id}
          className="border border-teal-500 rounded-lg shadow-md overflow-hidden bg-white transition-transform transform hover:scale-105 hover:shadow-lg relative"
        >
          {/* Link apenas no nome e imagem */}
          <Link href="./maps">
            <img
              src={themeImages[plan.theme.toUpperCase()] || "/img/themes/default.png"}
              alt={plan.theme}
              className="w-full h-48 object-cover cursor-pointer"
            />
          </Link>

          <div className="p-4">
            <Link href="./maps">
              <h3 className="text-lg font-semibold cursor-pointer hover:underline">
                {plan.name}
              </h3>
            </Link>
            {/* <p className="text-gray-600">Aulas: {plan?.classes?.length || 0}</p> */}
          </div>

          {isTeacher && (<div className="absolute bottom-2 right-2 flex space-x-2">

            <button
              onClick={() => handleDeletePlan(plan._id)}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <BsTrash size={16} />
            </button>
          </div>)}

        </div>
      ))}
    </div>
  );
};

export default LessonPlanCards;
