import React, { useContext } from 'react'

// Package imports
import { Button, Menu, HStack, ChevronLeftIcon, ChevronRightIcon } from 'native-base'
import propTypes from 'prop-types'

// Context API
import { SpaceBookContext } from '../../context/SpacebookContext'

export default function SearchOptions ({ changePage }) {
  // Context API
  const { pagination, setPagination } = useContext(SpaceBookContext)

  return (
    <HStack w='100%' justifyContent={'space-around'}>
      <HStack>
        <Button variant={'ghost'} leftIcon={<ChevronLeftIcon size='7' />} onPress={() => changePage('down')}>Previous Page</Button>
        <Button variant={'ghost'} rightIcon={<ChevronRightIcon size='7'/>} onPress={() => changePage('up')}>Next page</Button>
      </HStack>
      <Menu w='150' shouldOverlapWithTrigger={false} trigger={triggerProps => {
        return <Button {...triggerProps} variant={'ghost'}>
                  Pagination
              </Button>
      }}>
        <Menu.OptionGroup defaultValue={pagination.toString()} title="Pagination" type="radio" onChange={value => setPagination(Number(value))}>
          <Menu.ItemOption value="5">5</Menu.ItemOption>
          <Menu.ItemOption value="10">10</Menu.ItemOption>
          <Menu.ItemOption value="20">20</Menu.ItemOption>
          <Menu.ItemOption value="50">50</Menu.ItemOption>
        </Menu.OptionGroup>
      </Menu>
    </HStack>
  )
}

SearchOptions.propTypes = {
  changePage: propTypes.func.isRequired
}
