import React from "react";
import EditablePage from "@/components/editablePage/editablePage";
import { GetServerSideProps } from "next";
import { Block } from "@/components/editablePage/editablePage.type";

type PageProps = {
  pid: string
  blocks: Block[]
  err: boolean
}

export default function IndexPage ({ pid, blocks, err }: PageProps) {
  return <EditablePage id={pid} fetchedBlocks={blocks} err={err}/>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const blocks = [{ tag: 'p', html: '' }];
  const res = context.res;
  const req = context.req;
  try {
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/json');
    req.headers.cookie && requestHeaders.set('Cookie', req.headers.cookie);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/pages`, {
      method: 'POST',
      credentials: 'include',
      headers: requestHeaders,
      body: JSON.stringify({
        blocks: blocks
      })
    });
      const data = await response.json();
      const pageId = data.pageId;
      const creator = data.creator;
      const query = !creator ? '?public=true' : ''; // show notice
      res.writeHead(302, { Location: `/p/${pageId}${query}` });
      res.end();
      return { props: {} };
  } catch (err) {
    console.log(err);
    return { props: { blocks: [], pid: err, err: true} };
  }
}