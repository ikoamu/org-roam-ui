import React from 'react'
import {
  Menu,
  MenuItem,
  MenuList,
  Heading,
  MenuDivider,
} from '@chakra-ui/react'
import {
  ViewIcon,
  PlusSquareIcon,
  MinusIcon,
} from '@chakra-ui/icons'

import { OrgRoamNode } from '../api'
import { BiNetworkChart } from 'react-icons/bi'
import { TagMenu } from './TagMenu'
import { initialFilter, TagColors } from './config'
import { useSearchParams } from 'next/navigation'

export default interface ContextMenuProps {
  background: Boolean
  target: OrgRoamNode | string | null
  nodeType?: string
  coordinates: { [direction: string]: number | undefined }
  handleLocal: (node: OrgRoamNode, add: string) => void
  menuClose: () => void
  scope: { nodeIds: string[] }
  webSocket: any
  setPreviewNode: any
  setTagColors: any
  tagColors: TagColors
  setFilter: any
  filter: typeof initialFilter
}

export const ContextMenu = (props: ContextMenuProps) => {
  const {
    target,
    coordinates,
    handleLocal,
    menuClose,
    scope,
    setPreviewNode,
    setTagColors,
    tagColors,
    setFilter,
    filter,
  } = props;
  const param = useSearchParams();
  return (
    <>
      <Menu defaultIsOpen closeOnBlur={false} onClose={() => menuClose()}>
        <MenuList
          zIndex="overlay"
          bgColor="white"
          color="black"
          position="absolute"
          left={coordinates.left}
          top={coordinates.top}
          right={coordinates.right}
          bottom={coordinates.bottom}
          fontSize="xs"
          boxShadow="xl"
        >
          {typeof target !== 'string' ? (
            <>
              {target && (
                <>
                  <Heading size="xs" isTruncated px={3} py={1}>
                    {target.title}
                  </Heading>
                  <MenuDivider borderColor="gray.500" />
                </>
              )}
              {scope.nodeIds.length !== 0 && (
                <>
                  <MenuItem onClick={() => handleLocal(target!, 'add')} icon={<PlusSquareIcon />}>
                    Expand local graph at node
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleLocal(target!, 'replace')}
                    icon={<BiNetworkChart />}
                  >
                    Open local graph for this node
                  </MenuItem>
                  <MenuItem onClick={() => handleLocal(target!, 'remove')} icon={<MinusIcon />}>
                    Exclude node from local graph
                  </MenuItem>
                </>
              )}
              {scope.nodeIds.length === 0 && (
                <MenuItem icon={<BiNetworkChart />} onClick={() => handleLocal(target!, 'replace')}>
                  Open local graph
                </MenuItem>
              )}
              <MenuItem
                icon={<ViewIcon />}
                onClick={() => {
                  setPreviewNode(target)
                  if (target) {
                    console.log("search is ", window.location.search)
                    history.replaceState(null, '', window.location.pathname + window.location.search + `#${target.id}`);
                  }
                }}
              >
                Preview
              </MenuItem>
            </>
          ) : (
            <TagMenu {...{ target, tagColors, filter, setTagColors, setFilter }} />
          )}
        </MenuList>
      </Menu>
    </>
  )
}
