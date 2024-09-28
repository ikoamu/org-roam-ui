import { Box, Flex, IconButton } from '@chakra-ui/react'
import React, { FC, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { VscCircleFilled, VscCircleOutline } from 'react-icons/vsc'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { NoteContext } from '../../util/NoteContext'
import { DEFAULT_SECTION_OPEN } from '../../constants/action'

export interface SectionProps {
  className: string
}

export const Section: FC<PropsWithChildren<SectionProps>> = (props) => {
  const {
    children,
    className, // outline
  } = props
  const [open, setOpen] = useState(DEFAULT_SECTION_OPEN)
  const { collapse } = useContext(NoteContext)
  useEffect(() => {
    setOpen(!collapse)
  }, [collapse])

  if (!children) {
    return null
  }


  if (className === 'h0Wrapper headingWrapper') {
    return <Box className="preHeadingContent"> {children}</Box>
  }

  if (typeof children === 'string') {
    return <Box className="sectionContent">{children}</Box>
  }

  if (!Array.isArray(children)) {
    return <Box className="sectionContent">{children}</Box>
  }

  return (
    <Box className={'sec'}>
      <Box display="block">
        <Flex className="headingFlex" alignItems="baseline">
          {open && children.length > 0 ? (
            <>
              <IconButton
                className="viewerHeadingButton"
                _focus={{}}
                _active={{}}
                aria-label="Expand heading"
                //mr={1}
                size="xs"
                variant="subtle"
                icon={<ChevronUpIcon />}
                onClick={() => setOpen(!open)}
                height={2}
                width={2}
              />
              <IconButton
                className="outlineHeadingButton"
                _focus={{}}
                _active={{}}
                aria-label="Expand heading"
                //mr={1}
                size="xs"
                variant="subtle"
                icon={<VscCircleOutline />}
                onClick={() => setOpen(!open)}
                height={2}
                width={2}
              />
            </>
          ) : (
            <>
              <IconButton
                className="viewerHeadingButton"
                _active={{}}
                _focus={{}}
                aria-label="Collapse heading"
                //mr={1}
                height={2}
                width={2}
                size="xs"
                variant="subtle"
                icon={<ChevronDownIcon />}
                onClick={() => setOpen(!open)}
              />
              <IconButton
                className="outlineHeadingButton"
                _active={{}}
                _focus={{}}
                aria-label="Collapse heading"
                //mr={1}
                height={2}
                width={2}
                size="xs"
                variant="subtle"
                icon={<VscCircleFilled />}
                onClick={() => setOpen(!open)}
              />
            </>
          )}
          {children[0]}
        </Flex>
      </Box>
      {open && <Box className="sectionContent">{children?.slice(1)}</Box>}
    </Box>
  )
}
