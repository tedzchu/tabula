import EditablePage from "@/components/editablePage/editablePage";
import { GetServerSideProps } from "next";
import { PageProps } from "../types/index.type";

const Page = ({ pid, blocks, err }: PageProps) => {
  return <EditablePage id={pid} fetchedBlocks={blocks} err={err} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const pageId = context.query.pid;
  const req = context.req;
  try {
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/json');
    req.headers.cookie && requestHeaders.set('Cookie', req.headers.cookie);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/pages/${pageId}`,
      {
        method: "GET",
        credentials: "include",
        // Forward the authentication cookie to the backend
        headers: requestHeaders,
      }
    );
    const data = await response.json();
    return {
      props: { blocks: data.page.blocks, pid: pageId, err: false },
    };
  } catch (err) {
    console.log(err);
    return { props: { blocks: null, pid: null, err: true } };
  }
};

export default Page;