import React, { useRef } from 'react'
import {
  Box,
  Menu,
  MenuItem,
  MenuList,
  MenuGroup,
  MenuItemOption,
  MenuOptionGroup,
  Heading,
  MenuDivider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  PopoverTrigger,
  PopoverContent,
  Popover,
  Flex,
  PopoverBody,
  PopoverCloseButton,
  PopoverArrow,
  PopoverHeader,
  PopoverFooter,
  Portal,
  Text,
  VStack,
} from '@chakra-ui/react'
import {
  DeleteIcon,
  EditIcon,
  CopyIcon,
  AddIcon,
  ViewIcon,
  ExternalLinkIcon,
  ChevronRightIcon,
  PlusSquareIcon,
  MinusIcon,
} from '@chakra-ui/icons'

import { OrgRoamGraphReponse, OrgRoamLink, OrgRoamNode } from '../api'
import { deleteNodeInEmacs, openNodeInEmacs, createNodeInEmacs } from '../util/webSocketFunctions'
import { BiNetworkChart } from 'react-icons/bi'
import { TagMenu } from './TagMenu'
import { initialFilter, TagColors } from './config'

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
    background,
    target,
    nodeType,
    coordinates,
    handleLocal,
    menuClose,
    scope,
    webSocket,
    setPreviewNode,
    setTagColors,
    tagColors,
    setFilter,
    filter,
  } = props
  const { isOpen, onOpen, onClose } = useDisclosure()
  const copyRef = useRef<any>()
  return (
    <>
      <Menu defaultIsOpen closeOnBlur={false} onClose={() => menuClose()}>
        <MenuList
          zIndex="overlay"
          bgColor="white"
          color="black"
          //borderColor="gray.500"
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
              {/* Doesn't work at the moment
                            <MenuItem closeOnSelect={false} closeOnBlur={false}>
                            <Box _hover={{ bg: 'gray.200' }} width="100%">
                                <Popover
                                    initialFocusRef={copyRef}
                                    trigger="hover"
                                    placement="right-start"
                                    gutter={0}
                                >
                                    <PopoverTrigger>
                                        <MenuItem closeOnSelect={false} icon={<CopyIcon />}>
                                            <Flex justifyContent="space-between" alignItems="center">
                                                Copy...
                                                <ChevronRightIcon />
                                            </Flex>
                                        </MenuItem>
                                    </PopoverTrigger>
                                    <PopoverContent width={100}>
                                        <Menu defaultIsOpen closeOnBlur={false} closeOnSelect={false}>
                                            <MenuList bg="alt.100" zIndex="popover">
                                                <MenuItem ref={copyRef}>ID</MenuItem>
                                                <MenuItem>Title</MenuItem>
                                                <MenuItem>File path</MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </PopoverContent>
                                </Popover>
                            </Box>
                        </MenuItem> */}

              <MenuItem
                icon={<ViewIcon />}
                onClick={() => {
                  setPreviewNode(target)
                  if (target) {
                    history.replaceState(null, '', window.location.pathname + `#${target.id}`)
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

/* <Box>
 *     <Popover>
 *         <PopoverTrigger>
 *                 Permenantly delete node
 *             </MenuItem>
 *         </PopoverTrigger>
 *         <PopoverContent borderColor="red.500" _focus={{}}>
 *             <PopoverHeader fontWeight="semibold">Delete Node?</PopoverHeader>
 *             <PopoverArrow />
 *             <PopoverCloseButton onClick={onClose} />
 *             <PopoverBody>
 *                 This will permanently delete your node! Are you sure you want to do this?
 *             </PopoverBody>
 *             <PopoverFooter>
 *                 <Flex justifyContent="space-between" py={1}>
 *                     <Button colorScheme="gray" bg="gray.800" color="alt.100" width={30} onClick={onClose}>
 *                         Nah
 *                     </Button>
 *                     <Button colorScheme="red" variant="link" onClick={onClose}>
 *                         Delete node
 *                     </Button>
 *                 </Flex>
 *             </PopoverFooter>
 *         </PopoverContent>
 *     </Popover>
 * </Box> */
