import React from 'react'
import { Avatar, Divider, List, Space } from 'antd'
import crticsList from '../../../../static/critics.json'
import reviewsList from '../../../../static/movie-reviews.json'
import { Helmet } from 'react-helmet'
import { UserOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons'

const CriticsPage = () => {
  const IconText = ({ icon, text, title }) => (
    <Space title={title}>
      {React.createElement(icon)}
      {text}
    </Space>
  )

  return (
    <div className="md:container md:mx-auto my-10">
      <Helmet>
        <meta name="description" content="Critics" />
      </Helmet>
      <Divider orientation="left">Critics</Divider>
      <List
        itemLayout="horizontal"
        dataSource={crticsList}
        size="large"
        renderItem={item => {
          const reviewsByCritic = reviewsList.filter(
            i => i.byline.toLowerCase() === item.display_name.toLowerCase()
          )
          const criticPicks = reviewsByCritic.filter(i => i.critics_pick)

          return (
            <List.Item
              actions={[
                <IconText
                  icon={MessageOutlined}
                  text={reviewsByCritic.length}
                  key="list-vertical-message"
                  title="number of reviews by critic"
                />,
                <IconText
                  icon={LikeOutlined}
                  title="how many reviews are critics pick?"
                  text={criticPicks.length}
                  key="list-vertical-like-o"
                />,
              ]}>
              <List.Item.Meta
                avatar={
                  item.multimedia ? (
                    <Avatar
                      size="small"
                      shape="circle"
                      src={
                        <img
                          className="h-8 w-8 rounded-full"
                          src={
                            item.multimedia ? item.multimedia.resource.src : ''
                          }
                        />
                      }
                    />
                  ) : (
                    <Avatar
                      size="small"
                      className="rounded-full bg-gray-200"
                      shape="circle"
                      icon={<UserOutlined />}
                    />
                  )
                }
                title={item.display_name}
                description={item.bio}
              />
            </List.Item>
          )
        }}
        header={<div>Critics</div>}
      />
    </div>
  )
}

export default CriticsPage
