'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { X, Download, Smartphone } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageProvider'
import { getMessage } from '@/constants/messages'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
  }>
}

export function PWAInstallPrompt() {

  const { language } = useLanguage()

  const [deferredPrompt,setDeferredPrompt]=
  useState<BeforeInstallPromptEvent | null>(null)

  const [showPrompt,setShowPrompt]=
  useState(false)

  const [isIOS,setIsIOS]=
  useState(false)

  const [isInstalled,setIsInstalled]=
  useState(false)


  useEffect(()=>{

    // تشخیص iOS

    const isIOSDevice=
    /iPad|iPhone|iPod/.test(
      window.navigator.userAgent
    )

    setIsIOS(isIOSDevice)


    // بررسی نصب بودن

    if(
      window.matchMedia(
        '(display-mode: standalone)'
      ).matches
    ){

      setIsInstalled(true)
      return

    }


    // بررسی اینکه قبلاً بسته نشده باشد

    const lastDismissed=
    localStorage.getItem(
      'pwa-dismissed'
    )


    if(lastDismissed){

      const days=

      (Date.now()-parseInt(lastDismissed))

      /(1000*60*60*24)


      if(days<7){

        return

      }

    }


    // رویداد نصب

    const handler=(e:Event)=>{

      e.preventDefault()

      setDeferredPrompt(
        e as BeforeInstallPromptEvent
      )

      setShowPrompt(true)

    }


    window.addEventListener(
      'beforeinstallprompt',
      handler
    )


    // مخصوص iOS

    if(isIOSDevice){

      const isStandalone=

      (window.navigator as any)
      .standalone ?? false


      if(!isStandalone){

        setShowPrompt(true)

      }

    }


    return ()=>{

      window.removeEventListener(
        'beforeinstallprompt',
        handler
      )

    }

  },[])



  async function handleInstall(){

    if(!deferredPrompt) return

    await deferredPrompt.prompt()

    const {outcome}=
    await deferredPrompt.userChoice


    if(outcome==="accepted"){

      // INSTALL_PWA_MESSAGE در messages.ts از قبل تعریف شده بود ولی
      // هیچ‌جا صدا زده نمی‌شد — بعد از نصب موفق اپلیکیشن هیچ تاییدی به
      // کاربر نشان داده نمی‌شد.
      toast.success(getMessage("INSTALL_PWA_MESSAGE", language))

      setShowPrompt(false)

      setIsInstalled(true)

    }

    setDeferredPrompt(null)

  }



  function handleDismiss(){

    setShowPrompt(false)

    localStorage.setItem(

      'pwa-dismissed',

      Date.now().toString()

    )

  }



  if(isInstalled || !showPrompt){

    return null

  }



  return(

    <div className="pwa-install-banner fixed bottom-4 right-4 left-4 md:left-auto md:w-96 animate-slide-up">

      <div className="bg-white rounded-xl shadow-2xl border p-4">

        <div className="flex items-start gap-3">


          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">

            {isIOS ?

            <Smartphone className="w-6 h-6 text-blue-600"/>

            :

            <Download className="w-6 h-6 text-blue-600"/>

            }

          </div>


          <div className="flex-1 min-w-0">

            <h3 className="font-semibold text-sm">

              نصب اپلیکیشن سمساری نوربند

            </h3>


            <p className="text-xs text-gray-500 mt-1">

              {isIOS

              ?

              'برای نصب، گزینه Add To Home Screen را انتخاب کنید.'

              :

              'با نصب اپلیکیشن، دسترسی سریع‌تر و آفلاین خواهید داشت.'

              }

            </p>



            {isIOS ?

            <div className="mt-2 bg-gray-50 rounded-lg p-2 text-xs text-gray-600">

              <p>1- گزینه Share را انتخاب کنید.</p>

              <p>2- Add To Home Screen را بزنید.</p>

              <p>3- روی Add کلیک کنید.</p>

            </div>

            :

            <Button
            size="sm"
            className="mt-2"
            onClick={handleInstall}
            >

              <Download className="w-4 h-4 ml-1"/>

              نصب اپلیکیشن

            </Button>

            }

          </div>



          <button

          onClick={handleDismiss}

          className="p-1 hover:bg-gray-100 rounded-full"

          >

            <X className="w-4 h-4 text-gray-400"/>

          </button>


        </div>

      </div>

    </div>

  )

                }
