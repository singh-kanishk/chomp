import axios from 'axios' 

interface GetUuidBody{
    uuid:string;
}
 export async function getUuid (){
    await axios.get<GetUuidBody>('/')
 }