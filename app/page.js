'use client'
import Image from "next/image";
import {useState, useEffect} from 'react'
import {firestore} from '@/firebase'
import {Box, Modal, Typography, Stack, TextField, Button} from '@mui/material'
import {collection, deleteDoc, doc, getDocs, query, getDoc,setDoc} from 'firebase/firestore'

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])

  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const [searchQuery, setSearchQuery] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
    setFilteredInventory(inventoryList) // Initialize the filtered inventory

  }

  const addItem = async (item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
     
      await setDoc(docRef, {quantity: quantity + 1})
    }
    else{
      await setDoc(docRef, {quantity: 1})
    }
    await updateInventory()
  }

  const removeItem = async (item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if (quantity === 1){
        await deleteDoc(docRef)
      }
      else {
        await setDoc(docRef, {quantity: quantity -1})
      }
    }
    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  useEffect(() => {
    // Filter inventory based on search query
    setFilteredInventory(
      inventory.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  }, [searchQuery, inventory])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  
  document.body.style.transition = "background 10s";
  document.body.style.backgroundColor = "#ffe6ff";

  return (

    <Box 
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Box
        width="100%"
        textAlign="center"
        mb={4}
      >
        <Typography 
          variant="h1"
          color="#000000"
          sx={{
            fontWeight: 'bold',
            fontSize: '3rem'
          }}
        >
          <b>Patricia's Bakery</b>
        </Typography> 
        
      </Box>

     <Modal open={open} onClose={handleClose}>
        <Box 
        position="absolute" 
        top="50%" 
        left="50%"
        width={400}
        bgcolor="white"
        border="2px solid #000"
        boxShadow={24}
        p={4}
        display="flex"
        flexDirection="column"
        gap={3}
        sx={{
          transform: 'translate(-50%,-50%)',
        }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField 
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />
            <Button
            variant = "text" 
            onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}
            sx={{ 
              color: '#f9a2c4',
            
            }}
            >
              Add
            </Button>
          </Stack>
        </Box>
     </Modal>
      <Button
      variant="text"
      onClick={() => {
        handleOpen()
      }}
      sx={{ backgroundColor: '#fcb8e3',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#f9a2c4',
                    }
          }}
        >
          Add New Item
      </Button>

        <Box border="1px solid #333">
          <Box 
            width="800px" 
            height="100px" 
            bgcolor ="#ffabdf" 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
          >
            <Typography variant = 'h2' color ="#333"  > 
              <b>Inventory Items</b>
            </Typography>
          </Box>
        
          <TextField
          variant="outlined"
          fullWidth
          placeholder="Search Inventory..."
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2, width: '800px' }}
        />

        <Stack 
          width="800px"
          height="300px"
          spacing={2}
          overflow="auto">
          {filteredInventory.map(({name,quantity}) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgColor="#f0f0f0"
                padding={5}
              >
                <Typography variant = "h3" color = "#333" textAlign="center">
                  {name.charAt(0).toUpperCase()+name.slice(1)}
                </Typography>
                  
                <Typography variant = "h3" color = "#333" textAlign="center">
                  {quantity}
                </Typography>

                <Stack direction = "row" spacing={2}>
                  <Button
                    variant="text"
                    onClick={() => {
                      addItem(name)
                    }}
                    sx={{ backgroundColor: '#fcb8e3',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: '#f9a2c4',
                      }
                    }}
                >
                  Add
                </Button>
                </Stack>

                <Button variant = "text" onClick={()=>{
                  removeItem(name)
                }}
                sx={{ backgroundColor: '#fcb8e3',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#f9a2c4',
                  }
                }}
                
                >
                  Remove
                </Button>
              </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
