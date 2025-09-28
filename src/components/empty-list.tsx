interface IEmptyList {
  icon: React.ReactNode;
  title: string;
  description: string;
}
const EmptyList: React.FC<IEmptyList> = ({
  description, icon, title
}) => (
  <div className="w-full h-full flex flex-col items-center justify-center">
    {icon}
    <p className="text-[#0F0F0F] text-lg2 mt-5">{title}</p>
    <div className="text-sm text-[#5B5B5C] text-center mt-2">
      {description}
    </div>
  </div>
)

export default EmptyList;