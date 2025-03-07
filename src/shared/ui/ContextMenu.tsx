import React, {useState, useEffect} from "react";
import MoreVert from "./icons/more_vert.svg";
import BottomSheet from "#root/src/shared/ui/BottomSheet";

type ContextMenuProps = {
  options: Record<string, () => void>
}

const ContextMenu = ({options}: ContextMenuProps) => {
  const [isOpen, toggleIsOpen] = useState(false);

  useEffect(() => {
    const handleDocumentClick = () => toggleIsOpen(false)
    document.addEventListener('click', handleDocumentClick)
    return () => document.removeEventListener('click', handleDocumentClick)
  }, [isOpen]);


  const handleToggleClick = (e: React.MouseEvent<HTMLButtonElement> ) => {
    e.stopPropagation();
    toggleIsOpen(!isOpen);
  };

  return (
    <div className='relative'>
      <button onClick={handleToggleClick}>
        <MoreVert/>
      </button>
      {isOpen && <BottomSheet options={options}/>}
    </div>
  )
}

export default ContextMenu
