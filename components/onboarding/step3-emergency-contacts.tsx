"use client"
import OnboardingLayout from "./onboarding-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from '@/components/ui/card'
import { X, Plus } from "lucide-react"
import { useReclaim } from "@/contexts/reclaim-context"
import type { Contact as ReclaimContactType, ContactRelationship } from "@/lib/reclaim-types"
import { FC, useEffect, useState, useRef } from 'react'
import { StringUtils } from '@/app/utils/string.utils'
import { RevealInput } from '@/components/reveal-input'
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { WAGMI_CONTRACT_CONFIG, WagmiUseReadContractReturnType } from '@/app/utils/config'
import { useWeb3Auth } from '@/app/hooks/use-web3-auth'
import classes from '@/app/css/index.module.css'


interface Step3EmergencyContactsProps {
  onComplete: () => void
  onBack?: () => void
  currentStep: number
  totalSteps: number
}

export default function Step3EmergencyContacts({ onComplete, onBack, currentStep, totalSteps }: Step3EmergencyContactsProps) {
  const { address } = useAccount()
  const {
    state: { authInfo },
    fetchAuthInfo,
  } = useWeb3Auth()

  // Store authInfo in local state to persist it between renders
  const [localAuthInfo, setLocalAuthInfo] = useState<string | null>(null)
  // Flag to prevent duplicate fetches
  const isFetchingAuthRef = useRef(false)

  // Update localAuthInfo whenever authInfo changes from context
  useEffect(() => {
    if (authInfo) {
      setLocalAuthInfo(authInfo)
      console.log("AuthInfo updated from context:", authInfo.substring(0, 20) + "...")
    }
  }, [authInfo])

  // Use the stored authInfo or the context authInfo
  const effectiveAuthInfo = localAuthInfo || authInfo

  const { data: numbersListData, refetch: refetchNumbersList } = useReadContract({
    ...WAGMI_CONTRACT_CONFIG,
    functionName: 'getNumbersList',
    args: [effectiveAuthInfo],
    query: {
      enabled: !!effectiveAuthInfo,
    },
  }) satisfies WagmiUseReadContractReturnType<'getNumbersList', [string[], string[]], [string]>

  // DEBUG logging - remove in production
  useEffect(() => { 
    if (numbersListData) {
      console.log("numbersListData updated:", 
        numbersListData[0]?.length > 0 ? `${numbersListData[0].length} entries` : "empty")
    }
    if (effectiveAuthInfo) {
      console.log("Using effectiveAuthInfo:", effectiveAuthInfo.substring(0, 20) + "...")
    }
  }, [numbersListData, effectiveAuthInfo])

  const {
    data: addToNumbersListTxHash,
    writeContract,
    isPending: isWriteContractPending,
    isError: isWriteContractError,
    error: writeContractError,
  } = useWriteContract()
  const {
    isPending: isTransactionReceiptPending,
    isSuccess: isTransactionReceiptSuccess,
    isError: isTransactionReceiptError,
    error: transactionReceiptError,
  } = useWaitForTransactionReceipt({
    hash: addToNumbersListTxHash,
  })

  const isInteractingWithChain = isWriteContractPending || (addToNumbersListTxHash && isTransactionReceiptPending)

  const [numbersList, setNumbersList] = useState<{ names: string[], numbers: string[] } | null>(null)
  const [nameValue, setNameValue] = useState<string>('')
  const [numberValue, setNumberValue] = useState<string>('')
  const [numbersListRevealLabel, setNumbersListRevealLabel] = useState<string>('Tap to reveal')
  const [numbersListError, setNumbersListError] = useState<string | null>(null)
  const [entryError, setEntryError] = useState<string>()
  const [hasBeenRevealedBefore, setHasBeenRevealedBefore] = useState(false)

  // Safely fetch auth info only once on mount
  useEffect(() => {
    const fetchAuth = async () => {
      // Only fetch if we don't have auth info, have an address, and aren't already fetching
      if (!effectiveAuthInfo && address && !isFetchingAuthRef.current) {
        try {
          isFetchingAuthRef.current = true
          console.log("Attempting to fetch authInfo on mount...")
          
          // Try to fetch from URL first
          const urlParams = new URLSearchParams(window.location.search);
          const authParam = urlParams.get('auth');
          
          if (authParam && authParam.length > 100) {
            console.log("Using auth parameter from URL")
            setLocalAuthInfo(authParam)
          } else {
            // If no URL param, try to fetch from the hook
            await fetchAuthInfo()
            console.log("AuthInfo fetch attempt complete")
          }
        } catch (error) {
          console.error("Failed to fetch authInfo on mount:", error)
        } finally {
          isFetchingAuthRef.current = false
        }
      }
    }
    
    fetchAuth()
    // Only run this effect once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (effectiveAuthInfo && numbersListData) {
      setNumbersList({
        names: numbersListData[0],
        numbers: numbersListData[1],
      })
    }
  }, [numbersListData, effectiveAuthInfo])

  const fetchNumbersList = async () => {
    if (isFetchingAuthRef.current) return Promise.reject("Already fetching auth info")
    
    setNumbersListError(null)
    setNumbersListRevealLabel('Please sign message and wait...')

    try {
      isFetchingAuthRef.current = true
      
      // Only fetch auth info if we don't have it
      if (!effectiveAuthInfo) {
        await fetchAuthInfo()
        console.log("fetchNumbersList: fetchAuthInfo complete")
      }
      
      await refetchNumbersList()
      setNumbersListRevealLabel('')  // Use empty string instead of undefined
      setHasBeenRevealedBefore(true)

      return Promise.resolve()
    } catch (ex) {
      setNumbersListError((ex as Error).message)
      setNumbersListRevealLabel('Something went wrong! Please try again...')
      throw ex
    } finally {
      isFetchingAuthRef.current = false
    }
  }

  useEffect(() => {
    if (isTransactionReceiptSuccess) {
      setNameValue('')
      setNumberValue('')

      if (!hasBeenRevealedBefore) {
        setNumbersList(null)
        setNumbersListRevealLabel('Tap to reveal')
      } else {
        fetchNumbersList()
      }
    } else if (isTransactionReceiptError || isWriteContractError) {
      setEntryError(transactionReceiptError?.message ?? writeContractError?.message)
    }
  }, [isTransactionReceiptSuccess, isTransactionReceiptError, isWriteContractError])

  const handleRevealChanged = async (): Promise<void> => {              
    if (!isInteractingWithChain && !isFetchingAuthRef.current) {
      return await fetchNumbersList()
    }

    return Promise.reject()
  }

  const {
    contacts: contextContacts,
    addContactAndSendInvitation,
    removeContact: removeContextContact,
    isLoading,
  } = useReclaim()

  const handleAddToNumbersList = async () => {
    if (isFetchingAuthRef.current) {
      setEntryError('Still processing previous request')
      return
    }
    
    console.log("Starting handleAddToNumbersList");
    console.log("Wallet status:", { 
      address,
      hasAuth: !!effectiveAuthInfo,
      isInteractingWithChain
    });
    
    setEntryError(undefined)

    if (!address) {
      setEntryError('Please connect your wallet first')
      return
    }

    if (!nameValue) {
      setEntryError('Name is required!')
      return
    }

    if (!numberValue) {
      setEntryError('Number is required!')
      return
    }

    try {
      // If we don't have authInfo yet, fetch it
      let currentAuthInfo = effectiveAuthInfo
      if (!currentAuthInfo) {
        console.log("No authInfo available, fetching...");
        
        isFetchingAuthRef.current = true
        try {
          // Call fetchAuthInfo and wait for it to complete
          await fetchAuthInfo()
          // Check if we got authInfo from the context after fetching
          if (authInfo) {
            setLocalAuthInfo(authInfo)
            currentAuthInfo = authInfo
          }
        } finally {
          isFetchingAuthRef.current = false
        }
        
        if (!currentAuthInfo) {
          setEntryError('Authentication failed - please try again')
          return
        }
        
        console.log("AuthInfo fetched successfully")
      }

      console.log("Attempting contract write...");
      
      await writeContract({
        ...WAGMI_CONTRACT_CONFIG,
        functionName: 'addToNumbersList',
        args: [nameValue, numberValue, currentAuthInfo],
      })
    } catch (error) {
      console.error('Contract write error:', error)
      setEntryError((error as Error).message)
    }
  }

  const handleAddContact = async () => {
    if (isFetchingAuthRef.current) {
      setEntryError('Still processing previous request')
      return
    }
    
    console.log("Starting handleAddContact");
    if (nameValue.trim() && numberValue.trim()) {
      let determinedType: ReclaimContactType["type"] = "other"
      if (numberValue.includes("@")) {
        determinedType = "email"
      } else if (numberValue.match(/^\+?[0-9\s-()]+$/)) {
        determinedType = "phone"
      }

      console.log("Determined type:", determinedType);

      try {
        // If it's a phone number, add to the contract
        if (determinedType === "phone") {
          console.log("Phone number detected, calling handleAddToNumbersList");
          await handleAddToNumbersList()
        }

        // Add to contacts list
        const defaultRelationship: ContactRelationship = "Other"
        await addContactAndSendInvitation({
          name: nameValue.trim(),
          contactMethod: numberValue.trim(),
          type: determinedType,
          relationship: defaultRelationship,
        })

        // Clear the inputs after successful addition
        setNameValue("")
        setNumberValue("")
      } catch (error) {
        console.error('Error adding contact:', error)
        setEntryError((error as Error).message)
      }
    } else {
      console.log("Form validation failed:", { nameValue, numberValue });
    }
  }

  const handleRemoveContact = async (id: string) => {
    await removeContextContact(id)
  }

  // Manual way to set authInfo if we receive it directly from the user
  useEffect(() => {
    // Parse authInfo from the URL or query if it's available
    const parseUserProvidedAuth = () => {
      if (!effectiveAuthInfo && address) {
        // Check if auth was sent directly in the query
        try {
          const queryText = window.location.search || '';
          if (queryText.includes('authinfo') || queryText.includes('0x')) {
            // Extract potential auth string
            let potentialAuth = '';
            
            // Try to find a hex-like string (starts with 0x)
            const hexMatch = queryText.match(/0x[a-fA-F0-9]{10,}/);
            if (hexMatch) {
              potentialAuth = hexMatch[0];
            } 
            // Or look for authinfo parameter
            else if (queryText.includes('authinfo')) {
              potentialAuth = queryText.split('authinfo=')[1]?.split('&')[0] || '';
            }
            
            if (potentialAuth && potentialAuth.length > 100) {
              console.log("Found potential auth in query:", potentialAuth.substring(0, 20) + "...");
              setLocalAuthInfo(potentialAuth);
              return true;
            }
          }
        } catch (error) {
          console.error("Error parsing auth from query:", error);
        }
        return false;
      }
      return false;
    };
    
    // Only run once and don't re-run if we already have auth
    if (!localAuthInfo && !authInfo && !isFetchingAuthRef.current) {
      parseUserProvidedAuth();
    }
  }, [address, authInfo, effectiveAuthInfo, localAuthInfo]);

  return (
    <OnboardingLayout 
      stepNumber={currentStep} 
      totalSteps={totalSteps} 
      headerText="Add Emergency Contacts"
      onBack={onBack}
      showBackButton={true}
    >
      <p className="text-neutral-700 mb-6 text-lg">Add trusted contacts for recovery</p>

      {/* <RevealInput
              value={numbersList ? 
                numbersList.names.map((name, index) => `${name}: ${numbersList.numbers[index]}`).join('\n') : 
                ''
              }
              label={address}
              disabled
              reveal={!!numbersList}
              revealLabel={!!numbersList ? undefined : numbersListRevealLabel}
              onRevealChange={handleRevealChanged}
            />
            {numbersListError && <p className="error">{StringUtils.truncate(numbersListError)}</p>}
             */}
      <div className="space-y-4 mb-6 text-left">
        <Input
          type="text"
          value={nameValue}
          placeholder="Name"
          onChange={(e) => setNameValue(e.target.value)}
          className={entryError ? "border-red-500" : ""}
          disabled={isInteractingWithChain || isFetchingAuthRef.current}
        />
        {entryError && <p className="text-red-500 text-sm">{entryError}</p>}
        <Input
          type="text"
          value={numberValue}
          placeholder="Number"
          onChange={(e) => setNumberValue(e.target.value)}
          disabled={isInteractingWithChain || isFetchingAuthRef.current}
        />
        <Button
          onClick={handleAddToNumbersList}
          variant="outline"
          className="w-full border-[#00A86B] text-[#00A86B] hover:bg-[#00A86B]/10 rounded-md"
          aria-label="Add Contact"
          disabled={isLoading || isInteractingWithChain || isFetchingAuthRef.current}
        >
          <Plus className="mr-2 h-4 w-4" />
          {isLoading || isInteractingWithChain || isFetchingAuthRef.current ? "Adding..." : "Add Contact & Send Invite"}
        </Button>
      </div>

      {contextContacts.length > 0 && (
        <div className="mb-8 space-y-2 text-left">
          <h3 className="font-semibold text-neutral-800">Trusted Contacts:</h3>
          <ul className="list-none p-0">
            {contextContacts.map((contact) => (
              <li key={contact.contactId} className="flex justify-between items-center p-2 border-b border-neutral-200">
                <span className="text-sm text-neutral-700">
                  {contact.name} -{" "}
                  <span className="font-mono text-xs">
                    {contact.contactMethod} ({contact.type})
                  </span>
                  {contact.status === "pending_invitation" && (
                    <span className="ml-2 text-xs text-blue-600">(Invitation Pending)</span>
                  )}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveContact(contact.contactId)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-500/10"
                  aria-label={`Remove ${contact.name}`}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
          {/* <div className={classes.homePage}>
            <div className="card">
              <h2>Numbers Reclaim</h2>
              {address && (
                <>
                  <div className={classes.activeMessageText}>
                    <h3>Your Numbers List</h3>
                    <p>Your private numbers list stored on-chain.</p>
                  </div>
                  <RevealInput
                    value={numbersList ? 
                      numbersList.names.map((name, index) => `${name}: ${numbersList.numbers[index]}`).join('\n') : 
                      ''
                    }
                    label={address}
                    disabled
                    reveal={!!numbersList}
                    revealLabel={!!numbersList ? undefined : numbersListRevealLabel}
                    onRevealChange={handleRevealChanged}
                  />
                  {numbersListError && <p className="error">{StringUtils.truncate(numbersListError)}</p>}
                  <div className={classes.setMessageText}>
                    <h3>Add Entry</h3>
                    <p>Add a new name and number to your list.</p>
                  </div>
                  <Input
                    type="text"
                    value={nameValue}
                    placeholder="Name"
                    onChange={(e) => setNameValue(e.target.value)}
                    className={entryError ? "border-red-500" : ""}
                    disabled={isInteractingWithChain || isFetchingAuthRef.current}
                  />
                  {entryError && <p className="text-red-500 text-sm">{entryError}</p>}
                  <Input
                    type="text"
                    value={numberValue}
                    placeholder="Number"
                    onChange={(e) => setNumberValue(e.target.value)}
                    disabled={isInteractingWithChain || isFetchingAuthRef.current}
                  />
                  <div className={classes.setMessageActions}>
                    <Button disabled={isInteractingWithChain || isFetchingAuthRef.current} onClick={handleAddToNumbersList}>
                      {isInteractingWithChain || isFetchingAuthRef.current ? 'Please wait...' : 'Add Entry'}
                    </Button>
                  </div>
                </>
              )}
              {!address && (
                <>
                  <div className={classes.connectWalletText}>
                    <p>Please connect your wallet to get started.</p>
                  </div>
                </>
              )}
            </div>
          </div> */}
        </div> 
      )}

      <Button
        onClick={onComplete}
        className="w-full bg-[#00A86B] hover:bg-[#008F5B] text-white py-3 text-lg rounded-md"
        disabled={
          contextContacts.filter((c) => c.status === "active" || c.status === "pending_invitation").length === 0 ||
          isLoading
        }
        aria-label="Complete setup and continue"
      >
        Continue
      </Button>
      <p className="text-xs text-neutral-500 mt-2">
        Contacts will receive an invitation to join your network. You need at least one contact with a pending or active
        invitation to continue.
      </p>
    </OnboardingLayout>
  )
}
