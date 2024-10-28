import { useParams } from "react-router-dom";

function Tag() {
  const tagname = useParams();

  console.log(tagname);

  return (
    <>
      <div className="mt-20">
        <h2 className="w-full text-5xl font-bold text-center"><span>{tagname.id}</span></h2>
        <div className="flex justify-center mt-4 mb-6 divide-x divide-dotted">
          <span className="px-4 text-base text-[#6b6b6b]">Topic</span>
          <span className="px-4 text-base text-[#6b6b6b]">910k Followers</span>
          <span className="px-4 text-base text-[#6b6b6b]">56k Stories</span>
        </div>
        <div className="flex justify-center">
          <button className="px-4 py-2 bg-black rounded-full hover:opacity-75">
            <span className="text-white">Follow</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Tag;