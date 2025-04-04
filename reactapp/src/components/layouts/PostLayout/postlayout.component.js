import Header from "~/components/partial/Header/header.component";
import Footer from "~/components/partial/Footer/footer.component";
import { Toaster } from 'sonner';

function PostLayout({ children }) {
  return (
    <>
      <Header/>
      <div className="flex place-items-center my-14">
        <div className="container justify-center mx-auto">
          {/*<div>*/}
          {/*  <h2 className="text-center font-customs2 text-3xl">Welcome back.</h2>*/}
          {/*</div>*/}
          {/*<div className="py-11 px-14">{children}</div>*/}
          {children}
        </div>
      </div>
      <Footer/>
      <Toaster position="bottom-right" />
    </>
  );
}

export default PostLayout;