var net = require('net')
var net2 = require('net');
var chatServer = net.createServer(),
clientList = []
chatServer.on('connection', function(client){
	client.name = client.remoteAddress + ':' + client.remotePort
	client.write('Hi\n');
	
	clientList.push(client)
	client.on('data', function(data){
		 broadcast(data,client)});
})

function broadcast(message, client) {
  var cleanup = []
  for(var i=0;i<clientList.length;i+=1) {
    if(client !== clientList[i]) {

      if(clientList[i].writable) {
        clientList[i].write(message)
      } else {
        cleanup.push(clientList[i])
        clientList[i].destroy()
      }

    }
  }  //Remove dead Nodes out of write loop to avoid trashing loop index 
  for(i=0;i<cleanup.length;i+=1) {
    clientList.splice(clientList.indexOf(cleanup[i]), 1)
  }
}

chatServer.listen(9000);