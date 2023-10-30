import { ID, Query } from "appwrite";
import { INewPost, INewUser } from "@/types";
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

    console.log("je suis dans api", {uploadedFile});
    

    if (!uploadedFile) throw Error

    // get the file url
    const fileUrl = getFilePreview(uploadedFile.$id)

    console.log("je suis dans api - fileUrl", {fileUrl});

    if (!fileUrl){
      deleteFile(uploadedFile.$id)
      throw Error
    }

    // convert tags in an array
    const tags = post.tags?.replace(/ /g, '').split(',') || [] 

    console.log("je suis dans api - tags", {tags});


    console.log("je suis dans api - avant le save dans la database", post);

    // save the new post to the database
    const newPost = await databases.createDocument(
      ID.unique(),
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags
      }
    )

    console.log("je suis dans api - newPost", {newPost});

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


export async function getFilePreview(fileId: string) {
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


