/**
 * @typedef {Object} DigitalObject
 * @property {string} id
 * @property {string} name
 * @property {string} mediaType
 * @property {number} byteSize
 * @property {string} checksum
 * @property {string} thumbnail
 * @property {string} [master]
 * @property {string} [reference]
 * @property {string} [title]
 * @property {string} [description]
 * @property {string} [duration]
 * @property {string} [resolution]
 * @property {number} [pages]
 */

/**
 * @typedef {Object} DateInfo
 * @property {string} startDate
 * @property {string} [endDate]
 * @property {string} type
 * @property {string} [normalized]
 */

/**
 * @typedef {Object} Creator
 * @property {string} [id]
 * @property {string} name
 * @property {string} type
 * @property {string} [role]
 * @property {string} [biography]
 */

/**
 * @typedef {Object} Place
 * @property {string} [id]
 * @property {string} name
 * @property {string} type
 * @property {string} [note]
 * @property {Object} [coordinates]
 * @property {number} coordinates.lat
 * @property {number} coordinates.lng
 */

/**
 * @typedef {Object} Subject
 * @property {string} [id]
 * @property {string} term
 * @property {string} [vocabulary]
 */

/**
 * @typedef {Object} AtomItem
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {string} [alternativeTitle]
 * @property {string} levelOfDescription
 * @property {string} identifier
 * @property {string} [parentId]
 * @property {Object} [parent]
 * @property {DateInfo[]} dates
 * @property {Creator[]} creators
 * @property {string} scopeAndContent
 * @property {string} [arrangement]
 * @property {string} [appraisal]
 * @property {string} [accruals]
 * @property {string} physicalCharacteristics
 * @property {string} [findingAids]
 * @property {string} [originalsloc]
 * @property {string} [altformavail]
 * @property {string} [relatedmaterial]
 * @property {string[]} [bibliography]
 * @property {Subject[] | string[]} subjects
 * @property {Place[]} places
 * @property {Object[]} [names]
 * @property {DigitalObject[]} digitalObjects
 * @property {string} accessConditions
 * @property {string} reproductionConditions
 * @property {string} [physicalLocation]
 * @property {string} [immediateSource]
 * @property {string[]} language
 * @property {string[]} [script]
 * @property {Object[]} [notes]
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {Object} [createdBy]
 * @property {Object} [updatedBy]
 * @property {string} [thumbnail]
 * @property {number} [relevanceScore]
 */

/**
 * @typedef {Object} AtomCollection
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {string} levelOfDescription
 * @property {string} identifier
 * @property {DateInfo[]} dates
 * @property {string} extentAndMedium
 * @property {string} scopeAndContent
 * @property {string} arrangement
 * @property {string} accessConditions
 * @property {string} reproductionConditions
 * @property {string} physicalCharacteristics
 * @property {Object} repository
 * @property {Creator[]} creators
 * @property {string[]} language
 * @property {string[]} script
 * @property {string} thumbnail
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} AtomActor
 * @property {string} id
 * @property {string} slug
 * @property {string} authorizedFormOfName
 * @property {string[]} [parallelName]
 * @property {string} entityType
 * @property {string} [datesOfExistence]
 * @property {string} [biography]
 * @property {Place[]} [places]
 * @property {string[]} [occupations]
 * @property {string} [mandates]
 * @property {string} [generalContext]
 * @property {string[]} [sources]
 * @property {Object[]} [relatedItems]
 * @property {string} thumbnail
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} MapLocation
 * @property {string} id
 * @property {string} name
 * @property {Object} coordinates
 * @property {number} coordinates.lat
 * @property {number} coordinates.lng
 * @property {number} itemCount
 * @property {string} description
 * @property {Object[]} items
 */

/**
 * @typedef {Object} TimelineEvent
 * @property {string} id
 * @property {string} date
 * @property {string} title
 * @property {string} description
 * @property {Object[]} items
 */

/**
 * @typedef {Object} TaxonomyTerm
 * @property {string} id
 * @property {string} name
 * @property {number} count
 */

/**
 * @typedef {Object} StatisticData
 * @property {string | number} year
 * @property {string} region
 * @property {string} type
 * @property {string} subject
 * @property {number} count
 * @property {string} [totalSize]
 */

/**
 * @typedef {Object} ApiResponse
 * @property {AtomItem[] | AtomCollection[] | AtomActor[]} results
 * @property {number} total
 * @property {number} offset
 * @property {number} limit
 * @property {Object} [_links]
 * @property {Object} [facets]
 */

export default {};