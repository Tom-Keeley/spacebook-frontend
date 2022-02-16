import React, { useContext } from 'react'
import { Button, Menu } from 'native-base'
import { SimpleLineIcons } from '@expo/vector-icons'

// Context API
import { SpaceBookContext } from '../../context/SpacebookContext'

export default function SearchOptions () {
  const { pagination, setPagination } = useContext(SpaceBookContext)

  return (
    <Menu w="160" shouldOverlapWithTrigger={false} trigger={triggerProps => {
      return <Button ml={'1'} w={'10%'} {...triggerProps} variant={'ghost'}>
                <SimpleLineIcons name="options-vertical" size={24} color="black" />
            </Button>
    }}>
      <Menu.OptionGroup defaultValue={pagination} title="Pagination" type="radio" onChange={value => setPagination(value)}>
        <Menu.ItemOption value="5">5</Menu.ItemOption>
        <Menu.ItemOption value="10">10</Menu.ItemOption>
        <Menu.ItemOption value="20">20</Menu.ItemOption>
        <Menu.ItemOption value="50">50</Menu.ItemOption>
      </Menu.OptionGroup>
    </Menu>
  )
}
