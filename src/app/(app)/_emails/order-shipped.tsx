import React from 'react'
import { Order, User, Product, Media } from '@/payload-types'
import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount)
}

const getFirstProductImage = (product: Product): string | undefined => {
  if (product.media && product.media.length > 0) {
    const firstMedia = product.media[0]
    if (typeof firstMedia === 'object' && 'mediaItem' in firstMedia) {
      const mediaItem = firstMedia.mediaItem as Media
      return mediaItem.url || undefined
    }
  }
  return undefined
}

export default function OrderShippedEmail({ order, user }: { order: Order; user: Partial<User> }) {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Preview>{user.firstName}, your order is on it's way!</Preview>
      <Body
        style={{
          backgroundColor: '#557755',
          fontFamily: 'Arial, sans-serif',
          margin: 0,
          padding: 0,
        }}
      >
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Section style={{ backgroundColor: '#ffffff', padding: '20px' }}>
            <Img
              src={`${process.env.NEXT_PUBLIC_URL}/assets/email/fullLogo.png`}
              width="100"
              height="100"
              alt="Thankly Logo"
            />

            <Row style={{ textAlign: 'center' }}>
              <Column>
                <Link
                  href="www.thankly.co"
                  style={{ color: '#000000', textDecoration: 'none', marginRight: '20px' }}
                >
                  Home
                </Link>
              </Column>
              <Column>
                <Link
                  href="www.instagram.com/thankly.co"
                  style={{ color: '#000000', textDecoration: 'none', marginRight: '20px' }}
                >
                  Stalk us
                </Link>
              </Column>
              <Column>
                <Link href="www.thankly.co" style={{ color: '#000000', textDecoration: 'none' }}>
                  Send a Thankly
                </Link>
              </Column>
            </Row>

            <Section
              style={{
                backgroundColor: '#000000',
                color: '#ffffff',
                padding: '20px',
                marginTop: '20px',
                textAlign: 'center',
              }}
            >
              <Text style={{ margin: '0', fontSize: '14px' }}>EXCITING UPDATE!</Text>
              <Heading
                as="h2"
                style={{
                  fontFamily: "'League Spartan', sans-serif",
                  fontSize: '24px',
                  margin: '10px 0',
                  letterSpacing: '1px',
                }}
              >
                order is on it's way
              </Heading>
              <Text style={{ margin: '0', fontSize: '14px' }}>
                WE CAN'T WAIT FOR THEM TO SEE IT TOO!
              </Text>
            </Section>

            <Section style={{ padding: '20px 0' }}>
              <Text>Hi {user.firstName},</Text>
              <Text>Exciting news—your Thankly order has shipped! 🎉</Text>
              <Text>It's now on its merry way to deliver a big smile.</Text>
              <Text>We'll make sure it arrives safely, so keep an eye on that tracking link:</Text>
              {order.receivers &&
                order.receivers.length > 0 &&
                order.receivers[0].delivery?.tracking?.link && (
                  <Button
                    href={order.receivers[0].delivery.tracking.link}
                    style={{
                      backgroundColor: '#557755',
                      color: '#ffffff',
                      padding: '10px 20px',
                      textDecoration: 'none',
                      borderRadius: '5px',
                    }}
                  >
                    Track Your Order
                  </Button>
                )}
            </Section>

            <Section style={{ backgroundColor: '#f0f0f0', padding: '20px', marginTop: '20px' }}>
              <Text style={{ fontWeight: 'bold', marginBottom: '10px' }}>Order Summary</Text>
              {order.items &&
                order.items.map((item, index) => (
                  <Row key={index} style={{ marginBottom: '10px' }}>
                    <Column>
                      {typeof item.product === 'object' && getFirstProductImage(item.product) && (
                        <Img
                          src={getFirstProductImage(item.product)}
                          width="50"
                          height="50"
                          alt={item.product.title}
                        />
                      )}
                    </Column>
                    <Column>
                      <Text style={{ margin: 0 }}>
                        {typeof item.product === 'object' ? item.product.title : 'Product'}
                      </Text>
                      <Text style={{ margin: 0, fontSize: '12px' }}>Quantity: {item.quantity}</Text>
                    </Column>
                    <Column align="right">
                      <Text style={{ margin: 0 }}>{formatCurrency(item.price)}</Text>
                    </Column>
                  </Row>
                ))}
              <Hr style={{ borderColor: '#cccccc', margin: '20px 0' }} />
              <Row>
                <Column align="right">
                  <Text style={{ margin: 0 }}>Total:</Text>
                </Column>
                <Column align="right">
                  <Text style={{ margin: 0 }}>{formatCurrency(order.totals.total)}</Text>
                </Column>
              </Row>
            </Section>

            <Section style={{ padding: '20px 0' }}>
              <Text>We're almost there... just a little longer before the big reveal!</Text>
              <Text>
                Cheers,
                <br />
                The Thankly Team
              </Text>
            </Section>
          </Section>

          <Section style={{ backgroundColor: '#000000', padding: '20px', textAlign: 'center' }}>
            <Row>
              <Column>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 0C5.373 0 0 5.373 0 12c0 5.25 3.438 9.688 8.062 11.25.593.109.812-.25.812-.562 0-.281-.031-1.125-.031-2.062-3.094.562-3.75-1.375-3.75-1.375-.562-1.375-1.375-1.75-1.375-1.75-1.125-.75 0-1.125 0-1.125 1.125 0 1.625 1.125 1.625 1.125 1.125 1.875 2.875 1.375 3.5 1.125.125-.75.438-1.125.75-1.375-2.625-.281-5.375-1.375-5.375-6.125 0-1.375.5-2.5 1.375-3.375-.125-.281-.562-1.375.125-2.875 0 0 1.125-.375 3.75 1.375 1.125-.281 2.375-.375 3.625-.375 1.25 0 2.5.125 3.625.375 2.625-1.75 3.75-1.375 3.75-1.375.688 1.5.25 2.594.125 2.875.875.875 1.375 2 1.375 3.375 0 4.75-2.75 5.875-5.375 6.125.438.375.812 1.125.812 2.125 0 1.125-.031 2.125-.031 2.375 0 .312.218.687.812.562C20.563 21.688 24 17.25 24 12c0-6.627-5.373-12-12-12z"
                    fill="#000000"
                  />
                </svg>
              </Column>
              <Column>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.675 0h-21.35C.6 0 0 .6 0 1.325v21.35C0 23.4.6 24 1.325 24h21.35C23.4 24 24 23.4 24 22.675v-21.35C24 .6 23.4 0 22.675 0zM12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zm0 22.5c-5.75 0-10.5-4.75-10.5-10.5S6.25 1.5 12 1.5 22.5 6.25 22.5 12 17.75 22.5 12 22.5zm-1.5-16.5h-3v3h3v-3zm0 4.5h-3v9h3v-9zm4.5-4.5h-3v3h3v-3zm0 4.5h-3v9h3v-9z"
                    fill="#000000"
                  />
                </svg>
              </Column>
              <Column>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 0C5.373 0 0 5.373 0 12c0 5.25 3.438 9.688 8.062 11.25.593.109.812-.25.812-.562 0-.281-.031-1.125-.031-2.062-3.094.562-3.75-1.375-3.75-1.375-.562-1.375-1.375-1.75-1.375-1.75-1.125-.75 0-1.125 0-1.125 1.125 0 1.625 1.125 1.625 1.125 1.125 1.875 2.875 1.375 3.5 1.125.125-.75.438-1.125.75-1.375-2.625-.281-5.375-1.375-5.375-6.125 0-1.375.5-2.5 1.375-3.375-.125-.281-.562-1.375.125-2.875 0 0 1.125-.375 3.75 1.375 1.125-.281 2.375-.375 3.625-.375 1.25 0 2.5.125 3.625.375 2.625-1.75 3.75-1.375 3.75-1.375.688 1.5.25 2.594.125 2.875.875.875 1.375 2 1.375 3.375 0 4.75-2.75 5.875-5.375 6.125.438.375.812 1.125.812 2.125 0 1.125-.031 2.125-.031 2.375 0 .312.218.687.812.562C20.563 21.688 24 17.25 24 12c0-6.627-5.373-12-12-12z"
                    fill="#000000"
                  />
                </svg>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
