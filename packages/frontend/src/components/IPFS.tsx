import { Web3Storage } from 'web3.storage';
import { useEffect, useState } from 'react'
import ImageUploading from 'react-images-uploading';

// Construct with token and endpoint
const token = process.env.NEXT_PUBLIC_WEB3_STORAGE_KEY;
console.log("web3 storage key: ", token)
export const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3_STORAGE_KEY });
// const rootCid = "bafybeih3ih2r7ymkihyh5dov2nttb6lyla3irryeeyt26ty76744a3bdhq"
const rootCid = "bafybeibxxglqpoefmvf4g72s2xcoeq2ybd7ptznpujetx7d6nlafv66vhi"

// // Pack files into a CAR and send to web3.storage
// const rootCid = await client.put(fileInput.files) // Promise<CIDString>

// // Get info on the Filecoin deals that the CID is stored in
// const info = await client.status(rootCid) // Promise<Status | undefined>

// // Fetch and verify files from web3.storage
// const res = await client.get(rootCid) // Promise<Web3Response | null>
// const files = await res.files() // Promise<Web3File[]>
// for (const file of files) {
//   console.log(`${file.cid} ${file.name} ${file.size}`)
// }

const IPFS = () => {
    // const getImage = async () => {
    //     const res = await client.get(rootCid) // Promise<Web3Response | null>
    //     const files = await res.files() // Promise<Web3File[]>
    //     for (const file of files) {
    //         console.log(`${file.cid} ${file.name} ${file.size}`)
    //     }
    // }
    const [images, setImages] = useState([]);
    const [preview, setPreview] = useState(null);
    const getImgUrl = (rootCid, fileName) => `https://${rootCid}.ipfs.w3s.link/${fileName}`
    // useEffect(() => {
    //     getImage();
    // }, [])

    const upload = async () => {
        const file = images[0].file
        const name = "test11.png"
        const renamedFile = new File([file], name, {type: file.type});
        const cid = await client.put([renamedFile])
        
        const uploadedUrl = getImgUrl(cid, name)
        console.log("uploaded ", uploadedUrl)
        setPreview(uploadedUrl)
        return {cid, name}
    }
    const maxNumber = 69;

    const onChange = (imageList, addUpdateIndex) => {
        // data for submit
        console.log(imageList, addUpdateIndex);
        setImages(imageList);
    };

    return (
        <div>
            ipfs area
            <img src={preview} />
            <button onClick={upload} >Upload to ipfs</button>
            <ImageUploading
                multiple
                value={images}
                onChange={onChange}
                maxNumber={maxNumber}
                dataURLKey="data_url"
            >
                {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps,
                }) => (
                    // write your building UI
                    <div className="upload__image-wrapper">
                        <button
                            style={isDragging ? { color: 'red' } : undefined}
                            onClick={onImageUpload}
                            {...dragProps}
                        >
                            Click or Drop here
                        </button>
                        &nbsp;
                        <button onClick={onImageRemoveAll}>Remove all images</button>
                        {imageList.map((image, index) => (
                            <div key={index} className="image-item">
                                <img src={image['data_url']} alt="" width="100" />
                                <div className="image-item__btn-wrapper">
                                    <button onClick={() => onImageUpdate(index)}>Update</button>
                                    <button onClick={() => onImageRemove(index)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ImageUploading>
        </div>
    )
}

export default IPFS;