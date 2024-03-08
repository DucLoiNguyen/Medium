function Security() {
  return ( 
    <>
      <div className="divide-y">
        <div className="my-14">
          <button className="text-[#6b6b6b] hover:text-black my-8 text-right flex justify-between text-sm"><span className="mr-4 text-black">Reset password</span></button>
        </div>
        <div className="my-14">
          <button className="text-[#c94a4a] hover:text-red my-8 text-right flex justify-between text-sm"><span className="mr-4">Delete account</span></button>
        </div>
      </div>
    </>
  );
}

export default Security;