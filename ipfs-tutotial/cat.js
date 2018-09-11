'use strict'

const IPFS = require('ipfs')

const node = new IPFS()

node.on('ready', async () => {
	const version = await node.version()
  
	console.log('Version:', version.version)
  
	// const filesAdded = await node.files.add({
	//   path: 'hello.txt',
	//   content: Buffer.from('Hello World 101')
	// })
	
	// console.log('Added file:', filesAdded[0].path, filesAdded[0].hash)
  
	// const fileBuffer = await node.files.cat(filesAdded[0].hash)

	const hash = "QmXgZAUWd8yo4tvjBETqzUy3wLx5YRzuDwUQnBwRGrAmAo";
	const fileBuffer = await node.files.cat(hash)
  
	console.log('Added file contents:', fileBuffer.toString())
  })