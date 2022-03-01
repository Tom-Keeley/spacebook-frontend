import React, { useContext } from 'react'
import { Box, Button, Menu, HStack, VStack, Center, ChevronLeftIcon, ChevronRightIcon } from 'native-base'

// Context API
import { SpaceBookContext } from '../../context/SpacebookContext'

export default function SearchOptions () {
  const { pagination, setPagination } = useContext(SpaceBookContext)

  return (
    <HStack w='100%' justifyContent={'space-around'}>
      <HStack>
        <Button variant={'ghost'} leftIcon={<ChevronLeftIcon size='7' />}>Previous Page</Button>
        <Button variant={'ghost'} rightIcon={<ChevronRightIcon size='7'/>}>Next page</Button>
      </HStack>
      <Menu w='150' shouldOverlapWithTrigger={false} trigger={triggerProps => {
        return <Button {...triggerProps} variant={'ghost'}>
                  Pagination
              </Button>
      }}>
        <Menu.OptionGroup defaultValue={pagination} title="Pagination" type="radio" onChange={value => setPagination(value)}>
          <Menu.ItemOption value="5">5</Menu.ItemOption>
          <Menu.ItemOption value="10">10</Menu.ItemOption>
          <Menu.ItemOption value="20">20</Menu.ItemOption>
          <Menu.ItemOption value="50">50</Menu.ItemOption>
        </Menu.OptionGroup>
      </Menu>
    </HStack>
  )
}
