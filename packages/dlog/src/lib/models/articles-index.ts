import { IPFSPath } from 'ipfs/types/interface-ipfs-core/common';
import { ArticleHeader } from './';

/*
This class uses the concept of article_id.
article_id = article title with '-' instead of 
             space + a short hash composed of 
             the publication date of the article (see generateHash function)
 */

export class ArticlesIndex {
  //article_id -> article CID
  private index: Object;
  
  constructor() {
    this.index = new Object();
  }

  public addArticle(article_header: ArticleHeader, article_cid: IPFSPath): string {
    let article_id_removed_spaces = article_header.title.replace(/ /g, "-");
    let article_id = article_id_removed_spaces + "-" + this.generateHash();

    while (article_id in this.index) {
      article_id = article_id_removed_spaces + "-" + this.generateHash();
    }

    this.index[article_id] = article_cid;

    // return article_id, otherwise caller has no way to know which article_id the article got
    return article_id;
  }

  public removeArticle(article_id: string) {
    if (article_id in this.index) {
      delete this.index[article_id];

    // TODO: else throw an error? or do what?
    }
  }

  public updateArticle(article_id: string, article_cid: IPFSPath) {
    this.index[article_id] = article_cid;
  }

  // getArticle returns false if article_id is not in index,
  // hence it can be used also for a tool to check for existence of article_id in the index
  public getArticle(article_id: string): IPFSPath | boolean {
    if (article_id in this.index) 
      return this.index[article_id];
    else
      return false;
  }

  /**
   * Auxiliary functions
   */
  private generateHash(): String {
    return Math.floor(2147483648 * Math.random()).toString(36) + 
    Math.abs(Math.floor(2147483648 * Math.random()) ^ (0, this.getTimestamp)()).toString(36)
  }

  private getTimestamp = Date.now || function() {
    return +new Date
  }
}
