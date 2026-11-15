import { IoIosNotifications } from "react-icons/io";

export const Profile = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 bg-[#0B3D2E] text-white rounded-lg p-4">
      <div className="rounded-full flex items-center gap-4">
        <p className="text-sm font-dsiplay">Fazendo Terra Nova</p>
        <IoIosNotifications fontSize={20}/>
      </div>
    </div>
  );
};
