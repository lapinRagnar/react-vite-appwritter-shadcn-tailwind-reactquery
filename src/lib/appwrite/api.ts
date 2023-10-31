import { ID, Query } from "appwrite";
import { INewPost, INewUser, IUpdatePost } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";

export async function createUserAccount(user: INewUser) {
  
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    )

    if (!newAccount) throw Error

    const avatarUrl = avatars.getInitials(user.name)

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    })

    return newUser

  } catch (error) {
    console.log(error)
    return error
  }

}


export async function saveUserToDB(user: {
  accountId: string
  name: string
  email: string
  imageUrl: URL
  username?: string
}) {

  try {
    
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    )
    
    return newUser

  } catch (error) {
    console.log(error)
  }

}


export async function signInAccount(user: {
  email: string
  password: string
}) {

  try {
    const session = await account.createEmailSession(user.email, user.password)
    return session
  } catch (error) {
    console.log(error)
  }

}


export async function getCurrentUser() {

  try {

    const currentAccount = await account.get()

    console.log("dans api - getCurrentUser", currentAccount)
    
    if (!currentAccount) throw Error

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)],    // tena mbola manahirana - c'est reglé
    )

    if (!currentUser) throw Error

    return currentUser.documents[0]

  } catch (error) {
    console.log(error)
  }
}


export async function signOutAccount() {

  try {
    const session = await account.deleteSession("current")
    return session
  } catch (error) {
    console.log(error)
  }

}

export async function createPost(post: INewPost) {
  try {
    //upload image to storage
    const uploadedFile = await upLoadFile(post.file[0])    

    if (!uploadedFile) throw Error

    // get the file url
    const fileUrl = getFilePreview(uploadedFile.$id)

    if (!fileUrl){
      deleteFile(uploadedFile.$id)
      throw Error
    }

    // convert tags in an array
    const tags = post.tag?.replace(/ /g, '').split(',') || []
    console.log("api - createPost - tags", tags);
    

    console.log("data formulaire - avant enregistrement - api - ", {
      post
    })
    
    // save the new post to the database
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tag: post.tag
        // tag: tags
      }
    )

    if (!newPost){
      await deleteFile(uploadedFile.$id)
      throw Error
    }

    return newPost

  } catch (error) {
    console.log(error)
  }
}

export async function upLoadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    )
    return uploadedFile
  } catch (error) {
    console.log(error)
  }
}


export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    )
    return fileUrl
  } catch (error) {
    console.log(error)
  }
}


export async function deleteFile(fileId: string) {
  try {
    const deletedFile = await storage.deleteFile(appwriteConfig.storageId, fileId)
    return { deletedFile, status: 'ok'}
  } catch (error) {
    console.log(error)
  }
}


export async function getRecentPosts() {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc('$createdAt'), Query.limit(20)],
  )

  if (!posts) throw Error

  return posts
}


export async function likePost(postId: string, likesArray: string[]){
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray
      }
    )

    if (!updatedPost) throw Error
    
    return updatedPost

  } catch (error) {
    console.log(error)
  }
}

export async function savePost(postId: string, userId: string){
  
  console.log("le postId dans savePost dans api", postId)
  console.log("le userID dans savePost dans api", userId)
  
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        post: postId,
        user: userId
      }
    )

    if (!updatedPost) throw Error
    
    return updatedPost

  } catch (error) {
    console.log(error)
  }
}


export async function deleteSavedPost(savedRecordId: string){
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    )

    if (!statusCode) throw Error
    
    return {status: "ok, post bien supprimé!"}

  } catch (error) {
    console.log(error)
  }
}


export async function getPostById(postId: string) {
  try {

    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )

    return post

  } catch (error) {
    console.log(error)
  }
}




export async function updatePost(post: IUpdatePost) {


  const hasFileToUpdate = post.file?.length > 0
  console.log("api - hasFileToUpdate", hasFileToUpdate)
  
  
  try {

    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId
    }

    console.log("api - image", image);
    

    if (hasFileToUpdate){
      //upload image to storage
      const uploadedFile = await upLoadFile(post.file[0])    
      
      if (!uploadedFile) throw Error

      // get the file url
      const fileUrl = getFilePreview(uploadedFile.$id)
  
      if (!fileUrl){
        deleteFile(uploadedFile.$id)
        throw Error
      }

      image = {...image, imageUrl: fileUrl, imageId: uploadedFile.$id}
      console.log("api - image mise a jour", image);
      
      
    }




    // convert tags in an array
    const tags = post.tag?.replace(/ /g, '').split(',') || [] 
    console.log("api - tag", tags)
    

    console.log("data avant mise à jour", {
      caption: post.caption,
      imageUrl: image.imageUrl,
      imageId: image.imageId,
      location: post.location,
      tag: tags
    });
    
    // save the new post to the database
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tag: tags
      }
    )

    if (!updatedPost){
      await deleteFile(post.imageId)
      throw Error
    }

    return updatedPost

  } catch (error) {
    console.log(error)
  }
}


export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId) throw Error

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )

    return { status: "ok, post bien supprimé!"}
  } catch (error) {
    console.log(error)
  }
}