import Image from 'next/image'
import styles from './styles.module.scss'

export const Logos = () => {
  return (
    <div className={styles.logos}>
      <Image
        src={`${process.env.NEXT_PUBLIC_SERVER_URL}/payload.svg`}
        alt="Payload Logo"
        width={200}
        height={100}
        className={styles.payloadLogo}
        priority
      />
      <Image src="/crosshair.svg" alt="" width={20} height={20} />
      <Image
        src="/next.svg"
        alt="Next.js Logo"
        width={394}
        height={80}
        className={styles.nextLogo}
        priority
      />
    </div>
  )
}
