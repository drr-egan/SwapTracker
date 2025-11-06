import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  SWAPS: 'swaps',
  DEVICES: 'devices',
  CARRIERS: 'carriers',
  ADMINS: 'admins'
};

// User operations
export const createUser = async (userData) => {
  const docRef = await addDoc(collection(db, COLLECTIONS.USERS), {
    ...userData,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const getUser = async (userId) => {
  const docRef = doc(db, COLLECTIONS.USERS, userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const getAllUsers = async () => {
  const q = query(collection(db, COLLECTIONS.USERS), orderBy('lastName'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateUser = async (userId, userData) => {
  const docRef = doc(db, COLLECTIONS.USERS, userId);
  await updateDoc(docRef, {
    ...userData,
    updatedAt: Timestamp.now()
  });
};

export const deleteUser = async (userId) => {
  await deleteDoc(doc(db, COLLECTIONS.USERS, userId));
};

// Swap operations
export const createSwap = async (swapData) => {
  const docRef = await addDoc(collection(db, COLLECTIONS.SWAPS), {
    ...swapData,
    status: swapData.status || 'pending',
    newDeviceReceived: false,
    oldDeviceReturned: false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
};

export const getSwap = async (swapId) => {
  const docRef = doc(db, COLLECTIONS.SWAPS, swapId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const getAllSwaps = async () => {
  const q = query(collection(db, COLLECTIONS.SWAPS), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getSwapsByStatus = async (status) => {
  const q = query(
    collection(db, COLLECTIONS.SWAPS),
    where('status', '==', status),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getSwapsByAssignee = async (assignedTo) => {
  const q = query(
    collection(db, COLLECTIONS.SWAPS),
    where('assignedTo', '==', assignedTo),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateSwap = async (swapId, swapData) => {
  const docRef = doc(db, COLLECTIONS.SWAPS, swapId);
  await updateDoc(docRef, {
    ...swapData,
    updatedAt: Timestamp.now()
  });
};

export const deleteSwap = async (swapId) => {
  await deleteDoc(doc(db, COLLECTIONS.SWAPS, swapId));
};

// Device operations
export const createDevice = async (deviceData) => {
  const docRef = await addDoc(collection(db, COLLECTIONS.DEVICES), {
    ...deviceData,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const getAllDevices = async () => {
  const q = query(collection(db, COLLECTIONS.DEVICES), orderBy('userName'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getDevicesByUser = async (email) => {
  const q = query(
    collection(db, COLLECTIONS.DEVICES),
    where('email', '==', email)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateDevice = async (deviceId, deviceData) => {
  const docRef = doc(db, COLLECTIONS.DEVICES, deviceId);
  await updateDoc(docRef, deviceData);
};

export const deleteDevice = async (deviceId) => {
  await deleteDoc(doc(db, COLLECTIONS.DEVICES, deviceId));
};

// Carrier operations
export const createCarrier = async (carrierData) => {
  const docRef = await addDoc(collection(db, COLLECTIONS.CARRIERS), carrierData);
  return docRef.id;
};

export const getAllCarriers = async () => {
  const querySnapshot = await getDocs(collection(db, COLLECTIONS.CARRIERS));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateCarrier = async (carrierId, carrierData) => {
  const docRef = doc(db, COLLECTIONS.CARRIERS, carrierId);
  await updateDoc(docRef, carrierData);
};

// Statistics
export const getSwapStats = async () => {
  const swaps = await getAllSwaps();
  
  const stats = {
    total: swaps.length,
    pending: swaps.filter(s => s.status === 'pending').length,
    inProgress: swaps.filter(s => s.status === 'in-progress').length,
    completed: swaps.filter(s => s.status === 'completed').length,
    byCarrier: {
      'AT&T': swaps.filter(s => s.currentCarrier === 'AT&T').length,
      'Verizon': swaps.filter(s => s.currentCarrier === 'Verizon').length,
      'T-Mobile': swaps.filter(s => s.currentCarrier === 'T-Mobile').length
    },
    byAssignee: {}
  };
  
  swaps.forEach(swap => {
    if (swap.assignedTo) {
      stats.byAssignee[swap.assignedTo] = (stats.byAssignee[swap.assignedTo] || 0) + 1;
    }
  });
  
  return stats;
};

// Batch operations for importing data
export const batchCreateSwaps = async (swapsArray) => {
  const batch = writeBatch(db);
  const swapsRef = collection(db, COLLECTIONS.SWAPS);
  
  swapsArray.forEach(swap => {
    const docRef = doc(swapsRef);
    batch.set(docRef, {
      ...swap,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  });
  
  await batch.commit();
};

// Check if user is admin
export const isAdmin = async (userId) => {
  const docRef = doc(db, COLLECTIONS.ADMINS, userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
};
