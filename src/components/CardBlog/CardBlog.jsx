import React from 'react'

import { BlogInfo } from '../OurBlog/OurBlogData'
import ourBlogStyle from "../OurBlog/OurBlogStyle.module.css"

const CardBlog = () =>
{
    return (
        <div className={ourBlogStyle.divContainer}>

        {BlogInfo.map((item) => {
            return (
                <div className={ourBlogStyle.cardBlog}>
                    <a href={item.path}><img src={item.thumbnail} alt="" /></a>
                    <p><time>on {item.timePost}</time></p>
                    <article><a href="">{item.titlePost}</a></article>
                    <p>{item.description}</p>
                </div>
            );
        })}

    </div>
    )
}

export default CardBlog