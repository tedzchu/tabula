import React, { MutableRefObject, useEffect, useState } from 'react';
import { Block, Props } from './editablePage.type';
import usePrevious from '../../hooks/usePrevious';
import { setCaretToEnd, uid } from '../../util/util';
import EditableBlock from '../editableBlock/editableBlock';
import { useRouter } from 'next/router';

export default function EditablePage ({ id, fetchedBlocks, err }: Props) {
  if (err) {
    return (
        <h3>Something went wrong</h3>
    )
  }

  const router = useRouter();
  const [blocks, setBlocks] = useState<Block[]>(fetchedBlocks);
  const [currentBlockId, setCurrentBlockId] = useState<string | null>(null);

  const prevBlocks = usePrevious(blocks);
  
  // update db on blocks change
  useEffect(() => {
    const updatePageOnServer = async (blocks: Block[]) => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API}/pages/${id}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            blocks: blocks,
          }),
        });
      } catch (err) {
        console.log(err);
      }
    }
    if (prevBlocks && prevBlocks !== blocks) {
      updatePageOnServer(blocks);
    }
  }, [blocks, prevBlocks]);

  // handle cursor on add/delete blocks
  useEffect(() => {
    // add block
    if (prevBlocks && prevBlocks.length + 1 === blocks.length) {
      const nextBlockPosition = currentBlockId && blocks.map((b) => b._id).indexOf(currentBlockId) + 1 + 1;
      const nextBlock = document.querySelector(
        `[data-position="${nextBlockPosition}"]`
      );
      if (nextBlock) {
        (nextBlock as HTMLElement).focus();
      }
    }
    
    // delete block
    if (prevBlocks && prevBlocks.length - 1 === blocks.length) {
      const lastBlockPosition = currentBlockId && prevBlocks.map((b) => b._id).indexOf(currentBlockId);
      const lastBlock = document.querySelector(
        `[data-position="${lastBlockPosition}"]`
      );
      if (lastBlock) {
        setCaretToEnd(lastBlock as HTMLElement);
      }
    }
  }, [blocks, prevBlocks, currentBlockId])

  const updatePageHandler = (updatedBlock: Block) => {
    const index = blocks.map((b) => b._id).indexOf(updatedBlock._id);
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: updatedBlock.tag,
      html: updatedBlock.html
    };

    setBlocks(updatedBlocks);
  }

  const addBlockHandler = (currentBlock: Block) => {
    setCurrentBlockId(currentBlock._id);
    const index = blocks.map((b) => b._id).indexOf(currentBlock._id);
    const updatedBlocks = [...blocks];
    const newBlock = { _id: uid(), html: "", tag: "p" };
    updatedBlocks.splice(index + 1, 0, newBlock);
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: currentBlock.tag,
      html: currentBlock.html
    }
    setBlocks(updatedBlocks);
  }

  const deleteBlockHandler = (currentBlock: Block) => {
    if (blocks.length > 1) {
      setCurrentBlockId(currentBlock._id);
      const index = blocks.map((b) => b._id).indexOf(currentBlock._id);
      const updatedBlocks = [...blocks];
      updatedBlocks.splice(index, 1);
      setBlocks(updatedBlocks);
    }
  }

  const isNewPublicPage = router.query.public === 'true';
  return (
    <>
      {blocks.map((block) => {
        const position = blocks.map((b) => b._id).indexOf(block._id) + 1;
        return (
          <EditableBlock
            key={ block._id }
            id={ block._id }
            position={ position }
            tag={block.tag}
            html={block.html}
            updatePage={updatePageHandler}
            addBlock={addBlockHandler}
            deleteBlock={deleteBlockHandler}
          />
        )
      })}
    </>
  )
}
