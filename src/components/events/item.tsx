/* eslint-disable arrow-body-style */

interface IEventItem {
  srcImg: string;
  name: string;
  description: string;
  status: string;
  onDetail: () => void;
}

const EventItem: React.FC<IEventItem> = ({
  srcImg,
  name,
  description,
  status,
  onDetail
}) => {
  return (
    <div onClick={onDetail} className="bg-white rounded-xl overflow-hidden min-w-[300px] w-full">
      <div className="relative h-48 bg-gray-100">
        <img
          src={srcImg}
          alt={name}
          width={300}
          height={192}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">{status}</span>
        </div>
      </div>
      <div className="p-3">
        <div className="text-base font-medium">{name}</div>
        <div className="text-sm text-gray-500 mt-1">{description}</div>
      </div>
    </div>
  )
}

export default EventItem;