var summary = angular.module('schemasummaries', ['ui.bootstrap']);

summary.filter('patternInstances', function(){
	return function(pattern){
		var p = pattern.gPredicate.value;
		var o = pattern.gObject.value;
		var query = '';
		if(isDatatype(pattern.predicate.value).indexOf('DTP') > -1){
			query = 'select ?s <' + p + '> as ?p ?o ' +
			   'where{' + 
			   '?s a <' + pattern.gSubject.value + '> . ' +
			   '?s <' + p + '> ?o .' +
		   		'filter(datatype(?o) = <' + o + '>)' +
		   '} limit 100';
		}
		if(isDatatype(pattern.predicate.value).indexOf('DTP') > -1 && o.indexOf('XMLSchema#nonNegativeInteger') > -1){
			query = 'select ?s <' + p + '> as ?p ?o ' +
			   'where{' + 
			   '?s a <' + pattern.gSubject.value + '> . ' +
			   '?s <' + p + '> ?o .' +
		   		'filter(datatype(?o) = <http://www.w3.org/2001/XMLSchema#integer>)' +
		   '} limit 100';
		}
		if(isDatatype(pattern.predicate.value).indexOf('DTP') > -1 && o.indexOf('rdf-schema#Literal') > -1){
			query = 'select ?s <' + p + '> as ?p ?o ' +
			   'where{' + 
			   '?s a <' + pattern.gSubject.value + '> . ' +
			   '?s <' + p + '> ?o .' +
		   		'filter(isLiteral(?o) && lang(?o) != "")' +
		   '} limit 100';
		}
		if(isObject(pattern.predicate.value).indexOf('OP') > -1){
			query = 'select ?s <' + p + '> as ?p ?o ' +
			   'where{' + 
			   		'?s a <' + pattern.gSubject.value + '> . ' +
			   		'?o a <' + o + '> . ' +
			   		'?s <' + p + '> ?o .' +
			   '} limit 100';
		}
		return query;
	}
	
});

summary.filter('patternInstancesFromSearchResults', function(){
	return function(resource){
		if(resource.type.indexOf('datatype') > -1){
			query= 'select ?o ' +
			   'where{' +
			   		'?s ?p ?o ' +
			   		'filter(datatype(?o) = <' + resource.URI[0] + '>)' +
			   '} limit 100';
		}
		if(resource.type.indexOf('datatype') > -1 && resource.URI[0].indexOf('XMLSchema#nonNegativeInteger') > -1){
			query= 'select ?o ' +
			   'where{' +
			   		'?s ?p ?o ' +
			   		'filter(datatype(?o) = <http://www.w3.org/2001/XMLSchema#integer>)' +
			   '} limit 100';
		}
		if(resource.URI[0].indexOf('rdf-schema#Literal') > -1){
			query= 'select ?o ' +
			   'where{' + 
			   '?s ?p ?o . ' +
		   	   'filter(isLiteral(?o) && lang(?o) != "")' +
		   '} limit 100';
		}
		if(resource.type.indexOf('datatypeAkp') > -1){
			query= 'select ?s <' + resource.URI[1] + '> as ?p ?o ' +
			   'where{' + 
			   '?s a <' + resource.URI[0] + '> . ' +
			   '?s <' + resource.URI[1] + '> ?o .' +
		   		'filter(datatype(?o) = <' + resource.URI[2] + '>)' +
		   '} limit 100';
		}
		if(resource.type.indexOf('datatypeAkp') > -1 && resource.URI[2].indexOf('XMLSchema#nonNegativeInteger') > -1){
			query= 'select ?s <' + resource.URI[1] + '> as ?p ?o ' +
			   'where{' + 
			   '?s a <' + resource.URI[0] + '> . ' +
			   '?s <' + resource.URI[1] + '> ?o .' +
		   		'filter(datatype(?o) = <http://www.w3.org/2001/XMLSchema#integer>)' +
		   '} limit 100';
		}
		if(resource.type.indexOf('datatypeAkp') > -1 && resource.URI[2].indexOf('rdf-schema#Literal') > -1){
			query= 'select ?s <' + resource.URI[1] + '> as ?p ?o ' +
			   'where{' + 
			   '?s a <' + resource.URI[0] + '> . ' +
			   '?s <' + resource.URI[1] + '> ?o .' +
		   		'filter(isLiteral(?o) && lang(?o) != "")' +
		   '} limit 100';
		}
		if(resource.type.indexOf('objectAkp') > -1){
			query= 'select ?s <' + resource.URI[1] + '> as ?p ?o ' +
			   'where{' + 
			   		'?s a <' + resource.URI[0] + '> . ' +
			   		'?o a <' + resource.URI[2] + '> . ' +
			   		'?s <' + resource.URI[1] + '> ?o .' +
			   '} limit 100';
		}
		if(resource.type.indexOf('Property') > -1){
			query= 'select ?s <' + resource.URI[0] + '> as ?p ?o ' +
			   'where{' + 
			   		'?s <' + resource.URI[0] + '> ?o .' +
			   '} limit 100';
		}
		if(resource.type.indexOf('concept') > -1){
			query= 'select ?s ' +
			   'where{' + 
			   		'?s a <' + resource.URI[0] + '> .' +
			   '} limit 100';
		}
		return query;
	}
});

summary.filter('prefixed', function(){
	return prefixed;
});

prefixed = function(value){
	var namespace = value.match(/http:\/\/.*[/#]/g)[0];
	var localname = ":" + value.replace(namespace, "");
	var prefix = prefixes[namespace];
	if(!prefix){
		prefix = value;
		localname = '';
	}
	return prefix + localname;
}

summary.filter('escape', function(){
	return window.encodeURIComponent;
});

summary.filter('isDatatype', function(){
	return isDatatype;
});

isDatatype = function(value){
	if(value.indexOf('datatype-property') > -1) return 'DTP';
	return '';
};

summary.filter('isObject', function(){
	return isObject;
});

isObject = function(value){
	if(value.indexOf('object-property') > -1) return 'OP';
	return '';
};

summary.filter('asLabel', function(){
	return function(type){
		if(type == 'concept' || type == 'datatype') return 'success';
		if(type.indexOf('Property') > -1) return 'danger';
		if(type.indexOf('Akp')) return 'warning';
	};
});

summary.filter('asIcon', function(){
	return function(subtype){
		if(subtype.indexOf('external') > -1) return 'full';
		return 'small'
	};
});

summary.controller('browse', function ($scope, $http) {
	var summaries = new Summary($scope, $http, '');
	
	bootstrapControllerFor($scope, $http, 'select a dataset', summaries, '');
	
	summaries.startLoading();
	$http.get('/api/v1/datasets', {method: 'GET', params:{}})
		 .success(function(results){
			$scope.graphs = results['datasets'];
			summaries.endLoading();
		 });
});

summary.controller("search", function ($scope, $http) {
	var solr = new Solr($http);
	
	bootstrapSearchController($scope, solr, '');
});

summary.controller('experiment-browse', function ($scope, $http) {
	var summaries = new Summary($scope, $http, '?pattern a lds:Internal . ');
	
	bootstrapControllerFor($scope, $http, 'http://ld-summaries.org/dbpedia-3.9', summaries, '?pattern a lds:Internal . ');
	
	$scope.loadPatterns();
});

summary.controller('experiment-browse_dbp-2016-10-infobox-clean', function ($scope, $http) {
	var summaries = new Summary($scope, $http, '?pattern a lds:Internal . ');
	
	bootstrapControllerFor($scope, $http, 'http://ld-summaries.org/dbpedia-2016-10-infobox-NoExtConcepts', summaries, '?pattern a lds:Internal . ');
	
	$scope.loadPatterns();
});

summary.controller("experiment-search", function ($scope, $http) {
	var solr = new Solr($http);
	
	bootstrapSearchController($scope, solr, 'dbpedia-3.9');
});

bootstrapSearchController = function(scope, solr, dataset){
	
	var prepare = function(scope, solr, dataset){
		solr.noFilters();
		if(!scope.searchInExternalResources){
			solr.withFilter('subtype: internal');
		}
		if(dataset){
			solr.withFilter('dataset:' + dataset);
		}
		solr.search(scope.srcStr);
	};
	
	scope.loadPatterns = function(){
		solr.startFrom(0);
		prepare(scope, solr, dataset);
		solr.accumulate(function(results){
					scope.allDocuments = results.response.docs;
				});
	};
	
	var offset = 0;
	scope.loadMore = function(){
		offset+=10;
		solr.startFrom(offset);
		solr.accumulate(function(results){
					for (var i = 0; i < results.response.docs.length; i++) {
						scope.allDocuments.push(results.response.docs[i]);
				    }
				});
	};	
}

bootstrapControllerFor = function(scope, http, graph, summaries, filter){
	
	scope.loadPatterns = function(){
		
		scope.subject = undefined;
		scope.object = undefined;
		scope.predicate = undefined;
		
		scope.summaries = [];
		summaries.reset();
		summaries.load();
		
		scope.autocomplete = {};
		
		fill('subject', scope.selected_graph, scope.autocomplete, http, filter)
		fill('predicate', scope.selected_graph, scope.autocomplete, http, filter)
		fill('object', scope.selected_graph, scope.autocomplete, http, filter)
	};
	scope.filterPatterns = function(){
		
		scope.summaries = [];
		summaries.reset();
		summaries.load();
	}
	scope.loadMore = function(){
		summaries.load();
	};
	scope.selected_graph = graph;
	scope.describe_uri = '/describe/?uri=';
};

fill = function(type, graph, result, http, filter){
	
	result[type] = [];
	
	new Sparql(http)
	.query('select distinct(?' + type + ') ?g' + type + ' ' + 
			'where { '+
				'?pattern a lds:AbstractKnowledgePattern . ' +
				 filter +
	         	'?pattern rdf:' + type + ' ?' + type + ' . ' +
	         	'?' + type + ' rdfs:seeAlso' + ' ?g' + type + ' . ' +
         	'} ')
     .onGraph(graph)
     .accumulate(function(results){		    	 
    	 angular.forEach(results, function(key, value){
    		 var result = {};
    		 result['local'] = key[type].value;
    		 result['global'] = prefixed(key['g' + type].value);
    		 
    		 this.push(result)
    	 }, result[type]);
     });
};

Summary = function(scope_service, http_service, filter){
	
	var offset = 0;
	var limit = 20;
	var scope = scope_service;
	var http = http_service;
	var internalConstraint = filter;
	
	this.reset = function(){
		offset = 0;
	}
	
	this.startLoading = function(){
		scope.loadingSummary = true;
	}
	
	this.endLoading = function(){
		scope.loadingSummary = false;
	}
	
	this.load = function(){
		
		var localOrDefault = function(value, default_value){
			var value_to_return = default_value;
			if(value) value_to_return = '<' + value.local + '>';
			return value_to_return;
		}
		
		var subject = localOrDefault(scope.subject, '?subject');
		var predicate = localOrDefault(scope.predicate, '?predicate');
		var object = localOrDefault(scope.object, '?object');
		
		this.startLoading();
		endLoading = this.endLoading;
		
		new Sparql(http)
			.query('select ' + subject + ' as ?subject ' + predicate + ' as ?predicate ' + object + ' as ?object ?frequency ?instances ?max_M ?avg_M ?min_M ?max_N ?avg_N ?min_N ?pattern ?gSubject ?gPredicate ?gObject ?subjectOcc ?predicateOcc ?objectOcc ' +
				   ' where { ' +
						'?pattern a lds:AbstractKnowledgePattern . ' +
						internalConstraint +
						'?pattern rdf:subject ' + subject + ' . ' +
						'?pattern rdf:predicate ' + predicate + ' . ' + 
			         	'?pattern rdf:object ' + object + ' . ' +
			         	'?pattern lds:occurrence ?frequency . ' +

					'optional { ?pattern  lds:numberOfInstances ?instances . ' +
					'} . ' +
			         	'optional { ?pattern  lds:max_M_Cardinality ?max_M . ' +
					'} . ' +
			         	'optional { ?pattern  lds:avg_M_Cardinality ?avg_M . ' +
					'} . ' +
			         	'optional { ?pattern  lds:min_M_Cardinality ?min_M . ' +
					'} . ' +
			         	'optional { ?pattern  lds:max_N_Cardinality ?max_N . ' +
					'} . ' +
			         	'optional { ?pattern  lds:avg_N_Cardinality ?avg_N . ' +
					'} . ' +
			         	'optional { ?pattern  lds:min_N_Cardinality ?min_N . ' +
					'} . ' +

			         	subject + ' rdfs:seeAlso ?gSubject . ' +
			         	predicate +' rdfs:seeAlso ?gPredicate . ' +
			         	object + ' rdfs:seeAlso ?gObject . ' +
			         	'optional { ' +
			         		subject + ' lds:occurrence ?subjectOcc .' +
			         	'} . ' +
			         	'optional { ' +
			         		predicate + ' lds:occurrence ?predicateOcc .' +
			         	'} . ' +
			         	'optional { ' +
		         			object + ' lds:occurrence ?objectOcc . ' +
		         			'FILTER (?objectOcc > 0) ' +
		         		'} . ' +
					'} ' +
					'order by desc(?frequency) ' +
					'limit ' + limit + ' ' +
					'offset ' + offset)
			.onGraph(scope.selected_graph)
			.accumulate(function(results){
				offset = offset + 20;
				for (var i = 0; i < results.length; i++) {
					scope.summaries.push(results[i]);
			    }
				scope.graph_was_selected=true;
				endLoading();
			});
	}
}

Sparql = function(http_service){
	
	var http = http_service;
	var graph = "";
	var query;
	
	this.onGraph = function(target_graph){
		graph = target_graph;
		return this;
	};
	
	this.query = function(query_to_execute){
		query = query_to_execute;
		return this;
	};
	
	this.accumulate = function(onSuccess){
		http.get('/sparql', {
	        method: 'GET',
	        params: {
	            query: 'prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' +
		        	   'prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> ' +
		        	   'prefix lds:   <http://ld-summaries.org/ontology/> '+
		        	   'prefix skos:   <http://www.w3.org/2004/02/skos/core#> '+
	         	       query,
	            'default-graph-uri' : graph,
	            format: 'json'
	        }
	    }).success(function(res){
	    	onSuccess(res.results.bindings);
	    });
	};
};

Solr = function(connector){
	
	var http = connector;
	var textToSearch;
	var filters = [];
	var startIndex = 0;
	
	var escape = function(string){
		return string.toLowerCase()
					 .replace(/([&+-^!:{}()|\[\]\/\\])/g, "")
					 .replace(/ and /g, " ")
					 .replace(/ or /g, " ")
					 .replace(/ /g, " AND ");
	};
	
	this.search = function(text){
		textToSearch = text;
		return this;
	}
	
	this.withFilter = function(filter_to_add){
		filters.push(filter_to_add);
		return this;
	};
	
	this.noFilters = function(){
		filters = [];
	};
	
	this.startFrom = function(index){
		startIndex = index;
	};
	
	this.accumulate = function(callback){
		http.get('/solr/indexing/select', {
			method: 'GET',
			params: {
				wt: 'json',
				q: 'fullTextSearchField:(' + escape(textToSearch) + ')',
				rows: 20,
				start: startIndex,
				fq: filters,
				sort: 'occurrence desc'
			}})
		.success(callback);
	}
};
var prefixes = {
		"http://yago-knowledge.org/resource/": "yago",
		"http://www.w3.org/1999/02/22-rdf-syntax-ns#": "rdf",
		"http://xmlns.com/foaf/0.1/": "foaf",
		"http://dbpedia.org/ontology/": "dbo",
		"http://dbpedia.org/property/": "dbp",
		"http://purl.org/dc/elements/1.1/": "dc",
		"http://www.w3.org/2002/07/owl#": "owl",
		"http://www.w3.org/2000/01/rdf-schema#": "rdfs",
		"http://purl.org/net/ns/ontology-annot#": "ont",
		"http://www.w3.org/2004/02/skos/core#": "skos",
		"http://www.w3.org/2003/01/geo/wgs84_pos#": "geo",
		"http://www.ontotext.com/": "onto",
		"http://purl.org/rss/1.0/": "rss",
		"http://www.w3.org/ns/people#": "gldp",
		"http://rdfs.org/sioc/ns#": "sioc",
		"http://rdf.freebase.com/ns/": "fb",
		"http://www.geonames.org/ontology#": "geonames",
		"http://purl.org/science/owl/sciencecommons/": "sc",
		"http://www.w3.org/2001/XMLSchema#": "xsd",
		"http://www.w3.org/ns/org#": "org",
		"http://purl.org/goodrelations/v1#": "gr",
		"http://purl.org/linked-data/cube#": "qb",
		"http://purl.org/dc/terms/": "dcterms",
		"http://search.yahoo.com/searchmonkey/commerce/": "commerce",
		"http://purl.org/ontology/bibo/": "bibo",
		"http://purl.org/dc/terms/": "dct",
		"http://www.w3.org/ns/prov#": "prov",
		"http://www.w3.org/ns/md#": "md",
		"http://dbpedia.org/resource/": "dbpedia",
		"http://www.w3.org/ns/sparql-service-description#": "sd",
		"http://www.aktors.org/ontology/portal#": "akt",
		"http://rdfs.org/ns/void#": "void",
		"http://purl.org/vocab/vann/": "vann",
		"http://swrc.ontoware.org/ontology#": "swrc",
		"http://www.w3.org/ns/dcat#": "dcat",
		"http://www.productontology.org/id/": "pto",
		"http://www.w3.org/2006/vcard/ns#": "vcard",
		"http://purl.org/dc/dcmitype/": "dcmit",
		"http://yousuck.ca/": "content",
		"http://usefulinc.com/ns/doap#": "doap",
		"http://example.org/": "ex",
		"http://sw.opencyc.org/concept/": "cyc",
		"http://www.w3.org/1999/xhtml#": "xhtml",
		"http://purl.org/vocab/aiiso/schema#": "aiiso",
		"http://www.w3.org/2011/http#": "http",
		"http://xmlns.com/wot/0.1/": "wot",
		"http://creativecommons.org/ns#": "cc",
		"http://purl.org/dc/elements/1.1/": "dc11",
		"http://www.semanticdesktop.org/ontologies/2007/01/19/nie#": "nie",
		"http://www.w3.org/2006/gen/ont#": "gen",
		"http://purl.org/ontology/mo/": "mo",
		"http://www.rdfabout.com/rdf/schema/usbill/": "bill",
		"http://purl.org/vocab/relationship/": "rel",
		"http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1#": "d2rq",
		"http://purl.org/NET/c4dm/event.owl#": "event",
		"http://purl.org/vocab/bio/0.1/": "bio",
		"http://schemas.talis.com/2005/address/schema#": "ad",
		"http://rdfs.org/resume-rdf/": "cv",
		"http://webns.net/mvcb/": "admin",
		"http://www.w3.org/ns/r2rml#": "rr",
		"http://www.w3.org/ns/earl#": "earl",
		"http://www.w3.org/2002/12/cal/ical#": "ical",
		"http://data.semanticweb.org/ns/swc/ontology#": "swc",
		"http://ogp.me/ns#": "og",
		"http://wifo5-04.informatik.uni-mannheim.de/factbook/ns#": "factbook",
		"http://dig.csail.mit.edu/TAMI/2007/amord/air#": "air",
		"http://www.w3.org/2005/xpath-functions#": "fn",
		"http://www.w3.org/2000/10/swap/log#": "log",
		"http://purl.org/microformat/hmedia/": "media",
		"http://purl.org/NET/book/vocab#": "book",
		"http://www.holygoat.co.uk/owl/redwood/0.1/tags/": "tag",
		"http://purl.org/ontology/daia/": "daia",
		"http://purl.org/NET/biol/botany#": "botany",
		"http://rhizomik.net/ontologies/copyrightonto.owl#": "co",
		"http://commontag.org/ns#": "ctag",
		"http://rdf.data-vocabulary.org/#": "dv",
		"http://www.w3.org/ns/ma-ont#": "ma",
		"http://ontologi.es/days#": "days",
		"http://purl.org/net/biblio#": "biblio",
		"http://purl.org/ontology/similarity/": "musim",
		"http://www.ordnancesurvey.co.uk/ontology/AdministrativeGeography/v2.0/AdministrativeGeography.rdf#": "osag",
		"http://schemas.talis.com/2005/dir/schema#": "dir",
		"http://purl.org/dc/qualifiers/1.0/": "dcq",
		"http://dbpedia.org/resource/": "dbr",
		"http://purl.org/vocab/changeset/schema#": "cs",
		"http://purl.org/ontomedia/core/expression#": "ome",
		"http://jena.hpl.hp.com/ARQ/function#": "afn",
		"http://purl.org/ontology/af/": "af",
		"http://www.w3.org/2006/timezone#": "tzont",
		"http://purl.org/procurement/public-contracts#": "pc",
		"http://purl.org/cld/terms/": "cld",
		"http://purl.org/openorg/": "oo",
		"http://www.w3.org/2002/12/cal/ical#": "cal",
		"http://purl.org/reco#": "reco",
		"http://www.ontologydesignpatterns.org/cp/owl/informationrealization.owl#": "ir",
		"http://www.w3.org/2004/03/trix/rdfg-1/": "rdfg",
		"http://www.w3.org/1999/xhtml/vocab#": "xhv",
		"http://purl.org/stuff/rev#": "rev",
		"http://www.w3.org/2007/rif#": "rif",
		"http://www.w3.org/2001/XMLSchema#": "xs",
		"http://www.openrdf.org/config/repository/sail#": "sr",
		"http://gmpg.org/xfn/11#": "xfn",
		"http://schema.org/": "schema",
		"http://ontologies.smile.deri.ie/2009/02/27/memo#": "memo",
		"http://sw.deri.org/2005/08/conf/cfp.owl#": "cfp",
		"http://www.ontologydesignpatterns.org/cp/owl/componency.owl#": "cmp",
		"http://ontologi.es/giving#": "giving",
		"http://okkam.org/terms#": "ok",
		"http://purl.oclc.org/NET/sism/0.1/": "sism",
		"http://info.deepcarbon.net/schema/type#": "type",
		"http://www.w3.org/2002/xforms/": "xf",
		"http://purl.org/swan/1.2/discourse-elements/": "swande",
		"http://ltsc.ieee.org/rdf/lomv1p0/vocabulary#": "lomvoc",
		"http://www.w3.org/2000/10/swap/math#": "math",
		"http://purl.org/swan/1.2/qualifiers/": "swanq",
		"http://www.w3.org/2007/uwa/context/deliverycontext.owl#": "dcn",
		"http://www.kanzaki.com/ns/music#": "mu",
		"http://www.ontotext.com/trree/owlim#": "owlim",
		"http://purl.org/ontology/myspace#": "myspace",
		"http://d2rq.org/terms/jdbc/": "jdbc",
		"http://www.w3.org/2000/10/swap/pim/contact#": "con",
		"http://www.w3.org/2006/time#": "time",
		"http://www.morelab.deusto.es/ontologies/swrcfe#": "swrcfe",
		"http://www4.wiwiss.fu-berlin.de/drugbank/resource/drugbank/": "drugbank",
		"http://www.w3.org/2003/06/sw-vocab-status/ns#": "vs",
		"http://purl.org/vocab/frbr/core#": "frbr",
		"http://purl.org/vocommons/voaf#": "voaf",
		"http://www.w3.org/ns/auth/cert#": "cert",
		"http://data.ordnancesurvey.co.uk/ontology/spatialrelations/": "spacerel",
		"http://umbel.org/umbel/ac/": "ac",
		"http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#": "nfo",
		"http://www4.wiwiss.fu-berlin.de/sider/resource/sider/": "sider",
		"http://www.w3.org/2006/03/wn/wn20/schema/": "wn20schema",
		"http://www.w3.org/2011/content#": "cnt",
		"http://id.loc.gov/vocabulary/relators/": "marcrel",
		"http://rdfs.org/sioc/types#": "sioct",
		"http://data.linkedmdb.org/resource/movie/": "movie",
		"http://www.w3.org/ns/auth/rsa#": "rsa",
		"http://www.w3.org/ns/adms#": "adms",
		"http://open.vocab.org/terms/": "ov",
		"http://www.aktors.org/ontology/support#": "akts",
		"http://purl.org/xtypes/": "xtypes",
		"http://purl.org/ontology/service#": "service",
		"http://open-multinet.info/ontology/omn#": "omn",
		"http://linkedgeodata.org/triplify/": "lgd",
		"http://dbpedia.org/": "db",
		"http://purl.org/dc/terms/": "dcterm",
		"http://www.w3.org/2007/uwa/context/location.owl#": "loc",
		"http://www.rkbexplorer.com/ontologies/acm#": "acm",
		"http://purl.org/net/provenance/ns#": "prv",
		"http://purl.org/ontology/po/": "po",
		"http://www.geonames.org/ontology#": "gn",
		"http://iflastandards.info/ns/isbd/elements/": "isbd",
		"http://test2.example.com/": "test",
		"http://purl.uniprot.org/core/": "uniprot",
		"http://xmlns.com/wordnet/1.6/": "wn",
		"http://www.w3.org/2003/11/swrl#": "swrl",
		"http://www.cidoc-crm.org/cidoc-crm/": "crm",
		"http://www.openarchives.org/ore/terms/": "ore",
		"http://prismstandard.org/namespaces/basic/2.0/": "prism",
		"http://www.w3.org/ns/oa#": "oa",
		"http://www.w3.org/2006/link#": "link",
		"http://musicontology.com/": "music",
		"http://purl.org/NET/acc#": "acc",
		"http://inference-web.org/2.0/pml-justification.owl#": "pmlj",
		"http://www.daml.org/2001/03/daml+oil#": "daml",
		"http://chem.deri.ie/granatum/": "granatum",
		"http://purl.org/linked-data/sdmx#": "sdmx",
		"http://purl.org/NET/biol/zoology#": "zoology",
		"http://schemas.ogf.org/nml/2013/05/base#": "ndl",
		"http://purl.org/ontology/wo/": "wo",
		"http://purl.org/dc/dcam/": "dcam",
		"http://purl.org/ontology/prv/core#": "pr",
		"http://www.semanticdesktop.org/ontologies/2008/05/20/tmo#": "tmo",
		"http://purl.org/NET/c4dm/timeline.owl#": "tl",
		"http://umbel.org/umbel#": "umbel",
		"http://www.w3.org/2009/pointers#": "ptr",
		"http://linkedevents.org/ontology/": "lode",
		"http://bio2rdf.org/core#": "biocore",
		"http://www.w3.org/ns/auth/acl#": "acl",
		"http://www.loc.gov/mads/rdf/v1#": "madsrdf",
		"http://www.w3.org/2003/11/swrlb#": "swrlb",
		"http://www.metadata.net/harmony/ABCSchemaV5Commented.rdf#": "abc",
		"http://purl.org/rss/1.0/modules/taxonomy/": "taxo",
		"http://purl.org/NET/scovo#": "scovo",
		"http://dbpedia.org/owl/": "dbpediaowl",
		"http://www.w3.org/2007/uwa/context/java.owl#": "java",
		"http://bio2rdf.org/": "bio2rdf",
		"http://prefix.cc/nsogi:": "nsogi",
		"http://www.w3.org/ns/ldp#": "ldp",
		"http://www.kanzaki.com/ns/whois#": "whois",
		"http://qudt.org/vocab/unit#": "unit",
		"http://www.rdfabout.com/rdf/schema/politico/": "politico",
		"http://blogs.yandex.ru/schema/foaf/": "ya",
		"http://vivoweb.org/ontology/core#": "core",
		"http://www.w3.org/2007/05/powder-s#": "wdrs",
		"http://purl.org/net/compass#": "compass",
		"http://purl.org/ontomedia/ext/common/trait#": "omt",
		"http://protege.stanford.edu/system#": "protege",
		"http://www.w3.org/2008/05/skos-xl#": "skosxl",
		"http://demiblog.org/vocab/oauth#": "oauth",
		"http://purl.org/ontology/mo/mit#": "mit",
		"http://www.rdfabout.com/rdf/schema/usgovt/": "usgov",
		"http://www.w3.org/2004/09/fresnel#": "fresnel",
		"http://rdfs.org/scot/ns#": "scot",
		"http://www.ontologydesignpatterns.org/ont/web/irw.owl#": "irw",
		"http://www.w3.org/2003/12/exif/ns#": "exif",
		"http://purl.org/vocab/resourcelist/schema#": "resource",
		"http://purl.org/ontology/chord/": "chord",
		"http://eulergui.sourceforge.net/engine.owl#": "eg",
		"http://schemas.talis.com/2005/user/schema#": "user",
		"http://www.semanticdesktop.org/ontologies/2007/08/15/nao#": "nao",
		"http://iptc.org/std/rNews/2011-10-07#": "rnews",
		"http://spinrdf.org/sp#": "sp",
		"http://vocab.deri.ie/rooms#": "room",
		"http://www.ontologydesignpatterns.org/cp/owl/timeinterval.owl#": "ti",
		"http://www.w3.org/2000/10/swap/pim/doc#": "doc",
		"http://bibframe.org/vocab/": "bf",
		"http://purl.org/ontomedia/ext/common/being#": "omb",
		"http://www.w3.org/ns/formats/": "formats",
		"http://purl.org/ontology/symbolic-music/": "so",
		"http://courseware.rkbexplorer.com/ontologies/courseware#": "courseware",
		"http://purl.org/ontology/rec/core#": "rec",
		"http://purl.oclc.org/NET/nknouf/ns/bibtex#": "bibtex",
		"http://eventography.org/sede/0.1/": "sede",
		"http://www.w3.org/2005/Atom/": "atom",
		"http://purl.org/ontology/last-fm/": "lfm",
		"http://spinrdf.org/spin#": "spin",
		"http://spinrdf.org/spl#": "spl",
		"http://www.openrdf.org/config/repository#": "rep",
		"http://www.ontologydesignpatterns.org/cp/owl/informationobjectsandrepresentationlanguages.owl#": "irrl",
		"http://www.semanticdesktop.org/ontologies/2007/03/22/nco#": "nco",
		"http://geo.linkeddata.es/ontology/": "geoes",
		"http://purl.org/dc/dcmitype/": "dctype",
		"http://www.rdfabout.com/rdf/schema/vote/": "vote",
		"http://purl.org/lobid/lv#": "lv",
		"http://www.w3.org/2004/06/rei#": "rei",
		"http://annotation.semanticweb.org/2004/iswc#": "iswc",
		"http://www.w3.org/2007/05/powder#": "powder",
		"http://buzzword.org.uk/rdf/atomix#": "atomix",
		"http://purl.org/dc/elements/1.1/": "dce",
		"http://purl.org/media/audio#": "audio",
		"http://www.lingvoj.org/ontology#": "lingvoj",
		"http://purl.org/NET/lx#": "lx",
		"http://purl.org/obo/owl/GO#": "go",
		"http://www.rdfabout.com/rdf/schema/usfec/": "fec",
		"http://data.ordnancesurvey.co.uk/ontology/admingeo/": "admingeo",
		"http://www.semanticdesktop.org/ontologies/2007/08/15/nrl#": "nrl",
		"http://www4.wiwiss.fu-berlin.de/dailymed/resource/dailymed/": "dailymed",
		"http://ramonantonio.net/doac/0.1/#": "doac",
		"http://purl.org/net/vocab/2004/03/label#": "label",
		"http://purl.org/NET/biol/ns#": "biol",
		"http://deductions.sf.net/ontology/knowledge_base.owl#": "kb",
		"http://purl.org/ontology/last-fm/": "lastfm",
		"http://www.affymetrix.com/community/publications/affymetrix/tmsplice#": "affy",
		"http://purl.org/ontomedia/core/space#": "spc",
		"http://purl.org/net/ns/wordmap#": "wordmap",
		"http://rdf.ecs.soton.ac.uk/ontology/ecs#": "ecs",
		"http://www.rkbexplorer.com/ontologies/coref#": "coref",
		"http://resex.rkbexplorer.com/ontologies/resex#": "resex",
		"http://www.loa-cnr.it/ontologies/DUL.owl#": "dul",
		"http://purl.org/uF/hCard/terms/": "hcterms",
		"http://buzzword.org.uk/rdf/xen#": "xen",
		"http://schemas.microsoft.com/imm/": "imm",
		"http://www.w3.org/2000/10/swap/os#": "os",
		"http://moat-project.org/ns#": "moat",
		"http://rhizomik.net/ontologies/copyrightonto.owl#": "copyright",
		"http://telegraphis.net/ontology/measurement/code#": "code",
		"http://purl.org/ontomedia/ext/common/profession#": "omp",
		"http://purl.org/media/video#": "video",
		"http://openprovenance.org/ontology#": "opm",
		"http://dblp.uni-trier.de/rdf/schema-2015-01-26#": "dblp",
		"http://inference-web.org/2.0/pml-provenance.owl#": "pmlp",
		"http://umbel.org/umbel/ne/": "ne",
		"http://www.semanticdesktop.org/ontologies/2007/05/10/nexif#": "nexif",
		"http://www.w3.org/2003/01/geo/wgs84_pos#": "wgs84",
		"http://www.openrdf.org/config/sail#": "sail",
		"http://purl.org/stuff/project/": "prj",
		"http://purl.org/ibis#": "ibis",
		"http://www.ontologydesignpatterns.org/cp/owl/situation.owl#": "sit",
		"http://kwijibo.talis.com/": "kwijibo",
		"http://www.lotico.com/resource/": "lotico",
		"http://www.rkbexplorer.com/ontologies/resist#": "resist",
		"http://www.semanticdesktop.org/ontologies/2007/04/02/ncal#": "ncal",
		"http://purl.org/vocab/lifecycle/schema#": "lifecycle",
		"http://www.w3.org/2000/10/swap/pim/contact#": "contact",
		"http://www.dotnetrdf.org/leviathan#": "lfn",
		"http://rdf.data-vocabulary.org/#": "gd",
		"http://www.w3.org/2002/01/p3prdfv1#": "p3p",
		"http://purl.org/xro/ns#": "xro",
		"http://www.openrdf.org/schema/sesame#": "sesame",
		"http://www.junkwork.net/xml/DocumentList#": "doclist",
		"http://www.lotico.com/meetup/": "meetup",
		"http://purl.org/net/schemas/space/": "space",
		"http://www.openrdf.org/rdf/2009/metadata#": "meta",
		"http://vocab.org/waiver/terms/": "wv",
		"http://buzzword.org.uk/rdf/h5#": "h5",
		"http://purl.org/ontomedia/ext/common/bestiary#": "omc",
		"http://ontologi.es/lang/core#": "lang",
		"http://ontologies.ezweb.morfeo-project.org/eztag/ns#": "eztag",
		"http://www.semanticdesktop.org/ontologies/2007/03/22/nmo#": "nmo",
		"http://climb.dataincubator.org/vocabs/climb/": "climb",
		"http://eulersharp.sourceforge.net/2003/03swap/log-rules#": "es",
		"http://purl.org/ontology/myspace#": "myspo",
		"http://purl.org/vocab/riro/sdl#": "sdl",
		"http://sindice.com/hlisting/0.1/": "hlisting",
		"http://purl.org/swan/1.2/discourse-relationships/": "swandr",
		"http://purl.org/ns/meteo#": "meteo",
		"http://purl.org/net/rdf-money/": "money",
		"http://www.holygoat.co.uk/owl/redwood/0.1/tags/": "tags",
		"http://www.daml.org/2001/10/html/airport-ont#": "airport",
		"http://www.w3.org/2003/g/data-view#": "grddl",
		"http://www.w3.org/2007/uwa/context/hardware.owl#": "hard",
		"http://www.cogsci.princeton.edu/~wn/schema/": "wnschema",
		"http://buzzword.org.uk/rdf/xhtml-elements#": "xhe",
		"http://ltsc.ieee.org/rdf/lomv1p0/lom#": "lom",
		"http://vocab.deri.ie/c4n#": "c4n",
		"http://purl.org/NET/decimalised#": "ddc",
		"http://www.openrdf.org/config/sail/custom#": "custom",
		"http://purl.org/vocab/riro/ddl#": "ddl",
		"http://purl.org/swan/1.2/qualifiers/": "swanqs",
		"http://schemas.talis.com/2005/service/schema#": "sv",
		"http://ns.poundhill.com/phss/1.0/": "phss",
		"http://www.w3.org/2007/uwa/context/network.owl#": "net",
		"http://ns.inria.fr/prissma/v1#": "prissma",
		"http://purl.org/dc/dcmitype/": "dcmitype",
		"http://jena.hpl.hp.com/2008/tdb#": "tdb",
		"http://geovocab.org/geometry#": "ngeo",
		"http://madskills.com/public/xml/rss/module/trackback/": "trackback",
		"http://www4.wiwiss.fu-berlin.de/bizer/bsbm/v01/vocabulary/": "bsbm",
		"http://purl.org/ontology/similarity/": "sim",
		"http://www.w3.org/2004/03/trix/swp-2/": "swp",
		"http://www.ontologydesignpatterns.org/cpont/ire.owl#": "ire",
		"http://purl.org/vocab/riro/gpt#": "gpt",
		"http://purl.org/net/pingback/": "ping",
		"http://purl.org/spar/fabio/": "fabio",
		"http://a9.com/-/spec/opensearch/1.1/": "opensearch",
		"http://purl.org/spar/cito/": "cito",
		"http://www.w3.org/2007/05/powder#": "wdr",
		"http://www.w3.org/2000/10/swap/list#": "list",
		"http://inference-web.org/2.0/pml-relation.owl#": "pmlr",
		"http://purl.org/commerce/product#": "product",
		"http://purl.org/linguistics/gold/": "gold",
		"http://data.ordnancesurvey.co.uk/id/": "osgb",
		"http://ontologi.es/sparql#": "sparql",
		"http://www.w3.org/2007/uwa/context/web.owl#": "web",
		"http://ontologi.es/like#": "like",
		"http://foaf.qdos.com/lastfm/schema/": "qdoslf",
		"http://umbel.org/umbel/rc/": "umbelrc",
		"http://purl.org/b2bo#": "b2bo",
		"http://www.smileyontology.com/ns#": "smiley",
		"http://www.w3.org/2001/sw/DataAccess/tests/test-manifest#": "mf",
		"http://purl.org/NET/scovo#": "scv",
		"http://www.openrdf.org/config/sail/federation#": "fed",
		"http://purl.oclc.org/NET/ssnx/ssn#": "ssn",
		"http://topbraid.org/sparqlmotionlib#": "sml",
		"http://purl.org/ontology/cco/core#": "cco",
		"http://purl.org/vocab/frbr/extended#": "frbre",
		"http://diplomski.nelakolundzija.org/LTontology.rdf#": "lt",
		"http://sw.cyc.com/CycAnnotations_v1#": "cycann",
		"http://topbraid.org/sparqlmotionfunctions#": "smf",
		"http://web-semantics.org/ns/mysql/": "mysql",
		"http://purl.org/ontomedia/core/media#": "omm",
		"http://www.w3.org/ns/rdfa#": "rdfa",
		"http://www.semanticdesktop.org/ontologies/2007/05/10/nid3#": "nid3",
		"http://www.openrdf.org/rdf/2009/object#": "obj",
		"http://purl.org/tripfs/2010/02#": "tripfs",
		"http://web-semantics.org/ns/opensocial#": "osoc",
		"https://w3id.org/security#": "sec",
		"http://www.w3.org/2007/uwa/context/common.owl#": "common",
		"http://purl.org/foodontology#": "food",
		"http://tipsy.googlecode.com/svn/trunk/vocab/pmt#": "pmt",
		"http://purl.org/ontology/last-fm/": "gob",
		"http://www.w3.org/2002/xforms/": "xforms",
		"http://vocab.deri.ie/am#": "am",
		"http://ontologi.es/profiling#": "profiling",
		"http://purl.org/NET/puc#": "puc",
		"http://online-presence.net/opo/ns#": "opo",
		"http://zeitkunst.org/bibtex/0.1/bibtex.owl#": "bib",
		"http://purl.org/tio/ns#": "tio",
		"http://langegger.at/xlwrap/vocab#": "xl",
		"http://openlinksw.com/schemas/oat/": "oat",
		"http://semantic-mediawiki.org/swivt/1.0#": "swivt",
		"http://opencoinage.org/rdf/": "oc",
		"http://www.w3.org/2000/10/swap/string#": "string",
		"http://ontologies.ezweb.morfeo-project.org/ezcontext/ns#": "ezcontext",
		"http://plugin.org.uk/swh-plugins/": "swh",
		"http://www.w3.org/2003/01/geo/wgs84_pos#": "wgs",
		"http://www.w3.org/2004/02/image-regions#": "imreg",
		"http://purl.org/twc/vocab/conversion/": "conv",
		"http://purl.org/wf4ever/ro#": "ro",
		"http://www.w3.org/2005/07/aaa#": "states",
		"http://purl.org/NET/dady#": "dady",
		"http://purl.org/linkingyou/": "lyou",
		"http://www.w3.org/2000/10/swap/crypto#": "crypto",
		"http://www.w3.org/2007/uwa/context/push.owl#": "push",
		"https://w3id.org/payswarm#": "ps",
		"http://bblfish.net/work/atom-owl/2006-06-06/#": "awol",
		"http://purl.org/swan/1.2/agents/": "swanag",
		"http://models.okkam.org/ENS-core-vocabulary#": "okkam",
		"http://www.w3.org/2008/turtle#": "ttl",
		"http://telegraphis.net/ontology/geography/geography#": "geographis",
		"http://purl.org/swan/1.2/swan-commons/": "swanco",
		"http://hello.com/": "dummy",
		"http://purl.org/ontology/ao/core#": "ao",
		"http://purl.org/vocab/psychometric-profile/": "psych",
		"http://fliqz.com/": "urn",
		"http://conserv.deri.ie/ontology#": "conserv",
		"http://www.aifb.kit.edu/id/": "aifb",
		"http://dsnotify.org/vocab/eventset/0.1/": "evset",
		"http://purl.org/court/def/2009/coin#": "coin",
		"http://www.europeana.eu/schemas/edm/": "edm",
		"http://data.linkedct.org/resource/linkedct/": "ct",
		"http://purl.org/library/": "library",
		"http://purl.org/swan/1.2/pav/": "swanpav",
		"http://www.w3.org/2007/uwa/context/software.owl#": "soft",
		"http://www.w3.org/ns/sawsdl#": "sawsdl",
		"http://persistence.uni-leipzig.org/nlp2rdf/ontologies/nif-core#": "nif",
		"http://wiss-ki.eu/": "wisski",
		"http://purl.org/net/ldap/": "ldap",
		"http://purl.org/ontology/is/inst/": "isi",
		"http://ns.ontowiki.net/SysOnt/Site/": "site",
		"http://www.w3.org/1999/xhtml/vocab/": "xhtmlvocab",
		"http://data.ordnancesurvey.co.uk/id/postcodeunit/": "postcode",
		"http://vocab.deri.ie/rooms#": "rooms",
		"http://purl.org/NET/c4dm/timeline.owl#": "timeline",
		"http://purl.org/acco/ns#": "acco",
		"http://www.semanticdesktop.org/ontologies/2007/11/01/pimo#": "pimo",
		"http://buzzword.org.uk/rdf/personal-link-types#": "plink",
		"http://uriplay.org/spec/ontology/#": "play",
		"http://lod.taxonconcept.org/ontology/txn.owl#": "txn",
		"http://data.totl.net/game/": "game",
		"http://purl.org/swan/1.2/citations/": "swanci",
		"http://topbraid.org/sparqlmotion#": "sm",
		"http://semanticweb.org/id/": "swid",
		"http://www.bbc.co.uk/ontologies/sport/": "sport",
		"http://ns.aksw.org/Evolution/": "evopat",
		"http://www.w3.org/2005/01/wai-rdf/GUIRoleTaxonomy#": "wairole",
		"http://purl.org/vocab/relationship/": "ref",
		"http://freedesktop.org/standards/xesam/1.0/core#": "xesam",
		"http://www.w3.org/2002/01/bookmark#": "bookmark",
		"http://rdf.freebase.com/ns/": "freebase",
		"http://users.utcluj.ro/~raluca/ontology/Ontology1279614123500.owl#": "lark1",
		"http://purl.org/ontology/olo/core#": "olo",
		"http://www.w3.org/2007/ont/httph#": "httph",
		"http://purl.org/NET/uri#": "uri",
		"http://ns.ontowiki.net/SysOnt/": "sysont",
		"http://purl.org/muto/core#": "muto",
		"http://purl.org/ontology/is/quality/": "isq",
		"http://lsdis.cs.uga.edu/projects/semdis/opus#": "opus",
		"http://rdf.geospecies.org/ont/geospecies#": "geospecies",
		"http://users.utcluj.ro/~raluca/rdf_ontologies_ralu/ralu_modified_ontology_pizzas2_0#": "anca",
		"http://purl.org/NET/rulz#": "rulz",
		"http://www.gutenberg.org/2009/pgterms/": "pgterms",
		"http://www.opengis.net/ont/gml#": "gml",
		"http://www.semanlink.net/2001/00/semanlink-schema#": "sl",
		"http://www.semanticweb.org/ontologies/2010/6/Ontology1279614123500.owl#": "remus",
		"http://data.linkedct.org/vocab/": "linkedct",
		"http://purl.org/weso/cpv/": "cpv",
		"http://purl.org/ontology/is/types/": "ist",
		"http://www.w3.org/2007/rif-builtin-action#": "act",
		"http://purl.org/NET/yoda#": "yoda",
		"http://dayta.me/resource#": "dayta",
		"http://rdfs.org/sioc/actions#": "sioca",
		"http://lemon-model.net/lemon#": "lemon",
		"http://semanticscience.org/resource/": "sio",
		"http://www.w3.org/2002/12/cal/icaltzd#": "icaltzd",
		"http://lexvo.org/ontology#": "lvont",
		"http://purl.org/derecho#": "derecho",
		"http://obofoundry.org/ro/ro.owl#": "oboro",
		"http://ontologi.es/status#": "status",
		"http://purl.org/net/opmv/ns#": "opmv",
		"http://purl.org/twc/vocab/conversion/": "conversion",
		"http://www.xbrl.org/2003/instance#": "xbrli",
		"http://prov4j.org/w3p/": "w3p",
		"http://purl.obolibrary.org/obo/": "pobo",
		"http://www.agfa.com/w3c/2009/drugTherapy#": "drug",
		"http://purl.org/ontology/places#": "places",
		"http://ontologies.smile.deri.ie/pdo#": "pdo",
		"http://purl.org/net/provenance/types#": "prvtypes",
		"http://purl.oclc.org/NET/muo/muo#": "muo",
		"http://reference.data.gov.uk/def/intervals/": "interval",
		"http://sindice.com/vocab/search#": "search",
		"http://weblab-project.org/core/model/property/processing/": "wlp",
		"http://eulersharp.sourceforge.net/2003/03swap/log-rules#": "eu",
		"http://linkedgeodata.org/ontology/": "lgdo",
		"http://eprints.org/ontology/": "eprints",
		"http://www.biopax.org/release/biopax-level3.owl#": "biopax",
		"http://www.w3.org/ns/ui#": "ui",
		"http://rdvocab.info/Elements/": "rdagr1",
		"http://www.dotnetrdf.org/configuration#": "dnr",
		"http://d-nb.info/gnd/": "gnd",
		"http://philosurfical.open.ac.uk/ontology/philosurfical.owl#": "phil",
		"http://www.proteinontology.info/po.owl#": "prot",
		"http://www.w3.org/2006/http#": "httpvoc",
		"http://inference-web.org/2.0/pml-trust.owl#": "pmlt",
		"http://multimedialab.elis.ugent.be/organon/ontologies/ninsuna#": "nsa",
		"http://openean.kaufkauf.net/id/": "ean",
		"http://poshrdf.org/ns/posh/": "posh",
		"http://www.lotico.com/ontology/": "loticoowl",
		"http://www.w3.org/2003/01/geo/wgs84_pos#": "wgspos",
		"http://ns.inria.fr/nicetag/2010/09/09/voc#": "nt",
		"http://data.totl.net/tarot/card/": "tarot",
		"http://eulersharp.sourceforge.net/2003/03swap/agent#": "agents",
		"http://rdf.data-vocabulary.org/#": "gv",
		"http://eulersharp.sourceforge.net/2003/03swap/organism#": "organism",
		"http://www.georss.org/georss/": "georss",
		"http://launchpad.net/rdf/launchpad#": "lp",
		"http://eulersharp.sourceforge.net/2003/03swap/languages#": "languages",
		"http://purl.org/net/opmv/types/gridworks#": "gridworks",
		"http://eulersharp.sourceforge.net/2003/03swap/organization#": "organiz",
		"http://purl.org/twc/vocab/vsr#": "vsr",
		"http://west.uni-koblenz.de/ontologies/2010/07/dgfoaf.owl#": "dgfoaf",
		"http://purl.org/ontology/pbo/core#": "pbo",
		"http://www.w3.org/2005/sparql-results#": "res",
		"http://zbw.eu/namespaces/zbw-extensions/": "zbwext",
		"http://redfoot.net/2005/session#": "session",
		"http://purl.org/archival/vocab/arch#": "arch",
		"http://purl.org/ontology/is/core#": "is",
		"http://www.agfa.com/w3c/2009/healthCare#": "healthcare",
		"http://kaiko.getalp.org/dbnary#": "dbnary",
		"http://www4.wiwiss.fu-berlin.de/bizer/r2r/": "r2r",
		"http://purl.org/microformat/hmedia/": "ufmedia",
		"http://vocab.sindice.com/xfn#": "xfnv",
		"http://www.w3.org/2001/04/xmlenc#": "enc",
		"http://www.inria.fr/acacia/corese#": "cos",
		"http://ns.inria.fr/s4ac/v2#": "s4ac",
		"http://eulersharp.sourceforge.net/2003/03swap/countries#": "countries",
		"http://ontologi.es/rail/vocab#": "rail",
		"http://schemas.talis.com/2005/address/schema#": "address",
		"http://vocab.sindice.net/": "sindice",
		"http://eulersharp.sourceforge.net/2003/03swap/human#": "human",
		"http://purl.org/ontology/sco#": "sco",
		"http://proton.semanticweb.org/2005/04/protons#": "protons",
		"http://rs.tdwg.org/dwc/terms/": "dwc",
		"http://webtlab.it.uc3m.es/": "webtlab",
		"http://purl.org/twc/ontology/cdm.owl#": "cdm",
		"http://www.w3.org/2006/gen/ont#": "gso",
		"http://vocab.ouls.ox.ac.uk/projectfunding#": "arpfo",
		"http://sws.geonames.org/": "geodata",
		"http://purl.org/fab/ns#": "fab",
		"http://www.agetec.org/": "agetec",
		"http://purl.org/vocabularies/princeton/wordnet/schema#": "wordnet",
		"http://vocab.deri.ie/nocal#": "nocal",
		"http://govwild.org/0.6/GWOntology.rdf/": "govwild",
		"http://reference.data.gov.uk/def/payment#": "payment",
		"http://purl.org/ontology/dso#": "dso",
		"http://qudt.org/1.1/schema/qudt#": "qudt",
		"http://www.openlinksw.com/schemas/bif#": "bif",
		"http://purl.org/req/": "req",
		"http://purl.org/spar/c4o/": "c4o",
		"http://rdvocab.info/RDARelationshipsWEMI/": "rdrel",
		"http://eulersharp.sourceforge.net/2003/03swap/event#": "events",
		"http://www.metalex.eu/schema/1.0#": "metalex",
		"http://dev.w3.org/cvsweb/2000/quacken/vocab#": "quak",
		"http://reference.data.gov.uk/def/central-government/": "cgov",
		"http://eulersharp.sourceforge.net/2003/03swap/genomeAbnormality#": "genab",
		"http://ns.nature.com/terms/": "npg",
		"http://purl.org/commerce#": "com",
		"http://data.linkedmdb.org/sparql/": "linkedmdb",
		"http://www.ontologyportal.org/WordNet.owl#": "opwn",
		"http://www.w3.org/ns/regorg#": "rov",
		"http://knoesis.wright.edu/provenir/provenir.owl#": "provenir",
		"http://vocab.getty.edu/aat/": "aat",
		"http://www.w3.org/1999/XSL/Transform#": "xsl",
		"http://eulersharp.sourceforge.net/2003/03swap/bioSKOSSchemes#": "bioskos",
		"http://www.openlinksw.com/schemas/virtrdf#": "openlinks",
		"http://def.esd.org.uk/": "esd",
		"http://www.ashutosh.com/test/": "card",
		"http://xmlns.notu.be/aair#": "aair",
		"http://vitro.mannlib.cornell.edu/ns/vitro/public#": "vitro",
		"http://purl.org/linked-data/api/vocab#": "apivc",
		"http://ontologydesignpatterns.org/": "odp",
		"http://purl.org/twc/vocab/between-the-edges/": "bte",
		"http://uptheasset.org/ontology#": "ass",
		"http://erlangen-crm.org/current/": "cidoc",
		"http://purl.org/vso/ns#": "vso",
		"http://www.ebusiness-unibw.org/ontologies/consumerelectronics/v1#": "ceo",
		"http://www.mygrid.org.uk/ontology#": "mygrid",
		"http://rdf-vocabulary.ddialliance.org/discovery#": "disco",
		"http://www.w3.org/ns/person#": "person",
		"http://eulersharp.sourceforge.net/2003/03swap/care#": "care",
		"http://eulersharp.sourceforge.net/2003/03swap/log-rules#": "elog",
		"http://provenanceweb.org/ns/pml#": "pml",
		"http://semanticdiet.com/schema/usda/nndsr/": "nndsr",
		"http://eulersharp.sourceforge.net/2003/03swap/humanBody#": "humanbody",
		"http://purl.org/twc/vocab/datafaqs#": "datafaqs",
		"http://rdf.insee.fr/def/demo#": "idemo",
		"http://www.opengis.net/ont/geosparql#": "gsp",
		"http://www.awesomesauce.net/urmom/": "eat",
		"http://purl.obolibrary.org/obo/": "obo",
		"http://www.agfa.com/w3c/2009/hemogram#": "hemogram",
		"http://richard.cyganiak.de/": "kontakt",
		"http://dati.camera.it/ocd/": "ocd",
		"http://example.org/name#": "name",
		"http://www.agfa.com/w3c/2009/hospital#": "hospital",
		"http://www.w3.org/ns/hydra/core#": "hydra",
		"http://www.linkedmodel.org/1.0/schema/decl#": "decl",
		"http://purl.org/dita/ns#": "dita",
		"http://data-gov.tw.rpi.edu/2009/data-gov-twc.rdf#": "dgtwc",
		"http://purl.org/linked-data/cube#": "cube",
		"http://www.agfa.com/w3c/2009/malignantNeoplasm#": "malignneo",
		"http://www.agfa.com/w3c/2009/clinicalEvaluation#": "clineva",
		"http://purl.bioontology.org/ontology/EDAM/": "edam",
		"http://purl.org/ontology/cco/mappings#": "ccom",
		"http://tobyinkster.co.uk/#": "toby",
		"http://commons.psi.enakting.org/def/": "commons",
		"http://eulersharp.sourceforge.net/2003/03swap/agent#": "agent",
		"http://purl.org/obo/owl/SO#": "oboso",
		"http://info.deepcarbon.net/schema#": "dco",
		"http://purl.org/NET/cidoc-crm/core#": "cidoccrm",
		"http://www.tei-c.org/ns/1.0/": "tei",
		"http://www.w3.org/2001/XMLSchema#": "xds",
		"http://purl.org/twc/ontologies/cmo.owl#": "cmo",
		"http://webtlab.it.uc3m.es/2010/10/WebAppsOntology#": "wao",
		"http://www4.wiwiss.fu-berlin.de/cordis/resource/cordis/": "cordis",
		"http://purl.org/weso/uni/uni.html#": "uni",
		"http://vocab.linkeddata.es/urbanismo-infraestructuras/territorio#": "muni",
		"http://www.ebusiness-unibw.org/ontologies/eclass/5.1.4/#": "eco",
		"http://eulersharp.sourceforge.net/2003/03swap/unitsExtension#": "units",
		"http://www.gsi.dit.upm.es/ontologies/marl/ns#": "marl",
		"http://lod2.eu/schema/": "lod2",
		"http://www.w3.org/TR/2003/PR-owl-guide-20031209/food#": "fowl",
		"http://s.zemanta.com/ns#": "zem",
		"http://purl.org/wai#": "wai",
		"http://krauthammerlab.med.yale.edu/ontologies/gelo#": "gelo",
		"http://www.oegov.org/core/owl/gc#": "gc",
		"http://voag.linkedmodel.org/schema/voag#": "voag",
		"http://prefix.cc/": "prefix",
		"http://purl.org/hpi/patchr#": "pro",
		"http://vocab.deri.ie/br#": "br",
		"http://www.rdaregistry.info/": "rda",
		"http://purl.org/ontology/prv/rules#": "prvr",
		"http://www.w3.org/2005/11/its/rdf#": "itsrdf",
		"http://www.agfa.com/w3c/2009/clinicalProcedure#": "clinproc",
		"http://purl.org/twc/cabig/model/HINTS2005-1.owl#": "hints2005",
		"http://skipforward.net/skipforward/resource/": "skip",
		"http://bblfish.net/work/atom-owl/2006-06-06/#": "atomowl",
		"http://purl.org/net/provenance/ns#": "hartigprov",
		"http://purl.org/tripfs/2010/06#": "tripfs2",
		"http://purl.org/net/vocab/2004/07/visit#": "visit",
		"http://purl.obolibrary.org/obo/": "ero",
		"http://viaf.org/ontology/1.1/#": "viaf",
		"http://fise.iks-project.eu/ontology/": "fise",
		"http://catalogus-professorum.org/cpm/": "cpm",
		"http://rdf-vocabulary.ddialliance.org/xkos#": "xkos",
		"http://d-nb.info/gnd/": "dnb",
		"http://geovocab.org/spatial#": "spatial",
		"http://purl.org/weso/ontologies/scowt#": "scowt",
		"http://data.ordnancesurvey.co.uk/ontology/postcode/": "ospost",
		"http://purl.org/signature#": "sig",
		"http://www.w3.org/2000/10/annotation-ns#": "ann",
		"http://purl.org/theatre#": "theatre",
		"http://www.ifomis.org/bfo/1.1/span#": "span",
		"http://eulersharp.sourceforge.net/2003/03swap/quantitiesExtension#": "quantities",
		"http://rhizomik.net/ontologies/2005/03/Mpeg7-2001.owl#": "mpeg7",
		"http://eulersharp.sourceforge.net/2003/03swap/environment#": "environ",
		"http://spi-fm.uca.es/neologism/cerif#": "cerif",
		"http://dbpedia.org/resource/Category:": "category",
		"http://persistence.uni-leipzig.org/nlp2rdf/ontologies/rlog#": "rlog",
		"http://maven.apache.org/POM/4.0.0#": "pom",
		"http://purl.org/prog/": "prog",
		"http://www.tvblob.com/ratings/#": "rating",
		"http://www.ebi.ac.uk/efo/": "efo",
		"http://ecoinformatics.org/oboe/oboe.1.0/oboe-core.owl#": "oboe",
		"http://jena.hpl.hp.com/ARQ/property#": "pf",
		"http://purl.org/amicroformat/arecipe/": "arecipe",
		"http://jena.hpl.hp.com/Eyeball#": "eye",
		"http://purl.org/iso25964/skos-thes#": "isothes",
		"http://kdo.render-project.eu/kdo#": "kdo",
		"http://akonadi-project.org/ontologies/aneo#": "aneo",
		"http://www.w3.org/2011/http#": "htir",
		"http://semantictweet.com/": "semtweet",
		"http://purl.org/olia/olia.owl#": "olia",
		"http://www.w3.org/2001/sw/hcls/ns/transmed/": "transmed",
		"http://vocab.lenka.no/geo-deling#": "ngeoi",
		"http://www.w3.org/2005/01/wf/flow#": "wf",
		"http://www.semanticweb.org/ontologies/cheminf.owl#": "cheminf",
		"http://rdf.insee.fr/def/geo#": "igeo",
		"http://www.example.org/rdf#": "example",
		"http://zbw.eu/beta/p20/vocab/": "p20",
		"http://www.linkedmodel.org/schema/dtype#": "dtype",
		"http://open-services.net/ns/core#": "oslc",
		"http://www.w3.org/TR/owl-time#": "owltime",
		"http://purl.org/twc/health/vocab/": "health",
		"http://purl.org/pav/": "pav",
		"http://purl.org/commerce/creditcard#": "ccard",
		"http://km.aifb.kit.edu/projects/numbers/number#": "no",
		"http://www.loc.gov/mods/v3#": "mods",
		"http://rdfs.org/sioc/argument#": "arg",
		"http://www.rdfabout.com/rdf/usgov/geo/us/": "govtrackus",
		"http://aims.fao.org/aos/common/": "aims",
		"http://www.daml.org/services/owl-s/1.2/Service.owl#": "owls",
		"http://callimachusproject.org/rdf/2009/framework#": "calli",
		"http://models.okkam.org/ENS-core-vocabulary.owl#": "ens",
		"http://purl.org/coo/ns#": "coo",
		"http://kwantu.net/kw/": "kw",
		"http://open-services.net/ns/basicProfile#": "bp",
		"http://rdfs.org/sioc/types#": "sioctypes",
		"http://ontologies.hypios.com/out#": "out",
		"http://purl.org/ASN/schema/core/": "asn",
		"http://vocab.deri.ie/cogs#": "cogs",
		"http://sites.wiwiss.fu-berlin.de/suhl/bizer/d2r-server/config.rdf#": "d2r",
		"http://rdf.alchemyapi.com/rdf/v1/s/aapi-schema#": "aapi",
		"http://vocab.deri.ie/ppo#": "ppo",
		"http://purl.org/twc/health/vocab/aggregate/": "agg",
		"http://purl.org/rdo/ns#": "rdo",
		"http://vocab.org/transit/terms/": "transit",
		"http://ogp.me/ns#": "ogp",
		"http://www.music-encoding.org/ns/mei/": "mei",
		"http://www.w3.org/2005/01/wf/flow#": "flow",
		"http://ns.aksw.org/spatialHierarchy/": "shv",
		"http://www.w3.org/2003/01/geo/wgs84_pos#": "pos",
		"http://purl.org/tcga/core#": "tcga",
		"http://purl.org/uco/ns#": "uco",
		"http://datos.bcn.cl/ontologies/bcn-norms#": "bcnnorms",
		"http://openknowledgegraph.org/ontology/": "okg",
		"http://www.openannotation.org/ns/": "oac",
		"http://www4.wiwiss.fu-berlin.de/diseasome/resource/diseasome/": "diseasome",
		"http://purl.org/wf4ever/wfdesc#": "wfdesc",
		"http://wifo-ravensburg.de/semanticweb.rdf#": "rv",
		"http://xmlns.com/aerols/0.1/": "aerols",
		"http://data.ordnancesurvey.co.uk/ontology/50kGazetteer/": "gazetteer",
		"http://www.w3.org/2007/rif-builtin-function#": "func",
		"http://purl.org/olia/mte/multext-east.owl#": "mtecore",
		"http://purl.org/adms/sw/": "admssw",
		"http://purl.org/procurement/public-contracts-czech#": "pccz",
		"http://rdvocab.info/roles/": "rdarole",
		"http://data.press.net/ontology/stuff/": "pns",
		"http://reference.data.gov.uk/technical-registry/": "pronom",
		"http://stanbol.apache.org/ontology/enhancer/enhancer#": "enhancer",
		"http://purl.org/iso25964/skos-thes#": "iso",
		"http://atomowl.org/ontologies/atomrdf#": "atomrdf",
		"http://data.semanticweb.org/conference/ekaw/2012/complete/": "ekaw",
		"http://www.w3.org/ns/openannotation/extensions/": "oax",
		"http://purl.org/NET/schema-org-csv#": "scsv",
		"http://purl.org/vocab/frbr/core#": "frbrcore",
		"http://linkedscience.org/teach/ns#": "teach",
		"http://data.linkedct.org/vocab/resource/": "lctr",
		"http://scubadive.networld.to/dive.rdf#": "dive",
		"http://poderopedia.com/vocab/": "poder",
		"http://www.w3.org/2001/XMLSchema#": "xmls",
		"http://purl.org/hpi/patchr#": "pat",
		"http://saxon.sf.net/": "saxon",
		"http://aims.fao.org/aos/jita/": "jita",
		"http://datos.bne.es/resource/": "bne",
		"http://www.opmw.org/ontology/": "opmw",
		"http://purl.org/twc/ontology/frir.owl#": "frir",
		"http://www.w3.org/2001/02pd/rec54.rdf#": "rec54",
		"http://ns.nature.com/extensions/": "npgx",
		"http://www.w3.org/2003/05/soap-envelope/": "soap",
		"http://www.agfa.com/w3c/2009/humanDisorder#": "disease",
		"http://labels4all.info/ns/": "l4a",
		"http://purl.org/wf4ever/wfprov#": "wfprov",
		"http://www.e-lico.eu/data/kupkb/": "kupkb",
		"http://life.deri.ie/schema/": "life",
		"http://www.bl.uk/schemas/bibliographic/blterms#": "blt",
		"http://purl.org/germplasm/terms#": "germplasm",
		"http://dbpedia.org/resource/Category:": "dbc",
		"http://www.ebi.ac.uk/gxa/": "gxa",
		"http://www.openlinksw.com/virtrdf-data-formats#": "rdfdf",
		"http://www.padinthecity.com/": "ipad",
		"http://spatial.ucd.ie/lod/osn/": "osn",
		"http://bioinformatics.ua.pt/coeus/": "coeus",
		"http://openlinksw.com/services/facets/1.0/": "fct",
		"http://kasei.us/about/foaf.xrdf#": "greg",
		"http://lukasblaho.sk/football_league_schema#": "fls",
		"http://eulersharp.sourceforge.net/2006/02swap/fcm#": "fcm",
		"http://data.kasabi.com/dataset/eumida/terms/": "eumida",
		"http://www.mit.jyu.fi/ai/TRUST_Ontologies/QA.owl#": "qa",
		"http://www.linkedmodel.org/schema/vaem#": "vaem",
		"http://sweet.jpl.nasa.gov/2.0/mathOperation.owl#": "oper",
		"http://simile.mit.edu/2003/10/ontologies/artstor#": "artstor",
		"http://myprefix.org/": "myprefix",
		"http://purl.org/restdesc/http-template#": "tmpl",
		"http://sites.google.com/site/xgmaitc/": "marshall",
		"http://vivoweb.org/ontology/core#": "vivo",
		"http://purl.org/ontology/iron#": "iron",
		"http://purl.org/uF/hCard/terms/": "hcard",
		"http://www.bigdata.com/rdf#": "bd",
		"http://eulersharp.sourceforge.net/2003/03swap/fl-rules#": "fl",
		"http://www.infosys.com/": "infosys",
		"http://www.w3.org/TR/SVG/": "sgv",
		"http://www.isocat.org/ns/dcr.rdf#": "dcr",
		"http://purl.org/net/dssn/": "dssn",
		"http://purl.org/nxp/schema/v1/": "nxp",
		"http://www.w3.org/2000/10/swap/set#": "set",
		"http://www.agfa.com/w3c/2009/infectiousDisorder#": "infection",
		"http://reference.data.gov.uk/def/payment#": "pay",
		"http://www.openlinksw.com/campsites/schema#": "campsite",
		"http://www.wikidata.org/entity/": "wd",
		"http://ns.inria.fr/ast/sql#": "sql",
		"http://dbpedia.org/datatype/": "dt",
		"http://oanda2rdf.appspot.com/xch/": "xch",
		"http://prismstandard.org/namespaces/basic/2.1/": "prism21",
		"http://www.owl-ontologies.com/generations.owl#": "genea",
		"http://purl.org/makolab/caont/": "cao",
		"http://www.purl.org/ontologia/eseduc#": "eseduc",
		"http://www.freeclass.eu/freeclass_v1#": "fc",
		"http://stats.data-gov.ie/property/": "sdgp",
		"http://omv.ontoware.org/2005/05/ontology#": "omv",
		"http://linkedrecipes.org/schema/": "recipe",
		"http://purl.org/obo/owl/NCBITaxon#": "ncbitaxon",
		"http://vocab.deri.ie/fingal#": "fingal",
		"http://nlp2rdf.lod2.eu/schema/string/": "str",
		"http://lod.ac/ns/lodac#": "lodac",
		"http://purl.org/ontology/places/": "place",
		"http://purl.obolibrary.org/obo/iao.owl#": "iao",
		"http://foodable.co/ns/": "fd",
		"http://www.georss.org/georss/": "grs",
		"http://aers.data2semantics.org/vocab/": "aersv",
		"http://d-nb.info/standards/elementset/agrelon#": "agrelon",
		"http://purl.org/carfo#": "carfo",
		"http://bio2rdf.org/hgnc:": "hgnc",
		"http://purl.org/obo/owl/MS#": "ms",
		"http://purl.org/ontology/gbv/": "gbv",
		"http://purl.org/net/biordfmicroarray/ns#": "biordf",
		"http://escience.rpi.edu/ontology/sesf/s2s/4/0/": "s2s",
		"http://escience.rpi.edu/ontology/semanteco/2/0/pollution.owl#": "pol",
		"http://data.nytimes.com/elements/": "nytimes",
		"http://purl.org/telix#": "telix",
		"http://spatial.ucd.ie/2012/08/osmsemnet/": "osmsemnet",
		"http://d-nb.info/standards/elementset/gnd#": "gndo",
		"http://bing.com/schema/media/": "bing",
		"http://www.openlinksw.com/ski_resorts/schema#": "skiresort",
		"http://dbpedialite.org/things/": "dpl",
		"http://www.w3.org/1999/xlink/": "xlink",
		"http://ns.inria.fr/webmarks#": "wm",
		"http://purl.org/metainfo/terms/dsp#": "dsp",
		"http://hxl.humanitarianresponse.info/ns/#": "hxl",
		"http://dbpedia.org/class/yago/": "dbyago",
		"http://labs.mondeca.com/vocab/endpointStatus#": "ends",
		"http://bio2rdf.org/chebi:": "chebi",
		"http://www.w3.org/ns/rad#": "rad",
		"http://reference.data.gov.uk/def/intervals/": "intervals",
		"http://ns.inria.fr/ratio4ta/v1#": "r4ta",
		"http://www.holygoat.co.uk/owl/redwood/0.1/tags/": "hg",
		"http://purl.org/twc/ontologies/identity.owl#": "identity",
		"http://www.mygrid.org.uk/mygrid-moby-service#": "moby",
		"http://geovocab.org/geometry#": "geom",
		"http://purl.org/lex#": "lex",
		"http://purl.org/NET/c4dm/event.owl#": "c4dm",
		"http://spinrdf.org/spif#": "spif",
		"http://semanticweb.cs.vu.nl/2009/11/sem/": "sem",
		"http://www.systemone.at/2006/03/wikipedia#": "wikipedia",
		"http://www.nanopub.org/nschema#": "np",
		"http://schema.omg.org/spec/CTS2/1.0/": "cts2",
		"http://data.lirmm.fr/ontologies/osp#": "osp",
		"http://data.press.net/ontology/event/": "pne",
		"http://nl.ijs.si/ME/owl/": "mte",
		"http://www.w3.org/2006/03/wn/wn20/": "wn20",
		"http://www.openk.org/wscaim.owl#": "wscaim",
		"http://purl.org/NET/cloudisus#": "cis",
		"http://linkedrecipes.org/schema/": "lr",
		"http://iflastandards.info/ns/fr/frad/": "frad",
		"http://www.example.org/terms/": "exterms",
		"http://web.resource.org/rss/1.0/modules/syndication/": "rssynd",
		"http://rhizomik.net/ontologies/copyrightonto.owl#": "cro",
		"http://buzzword.org.uk/rdf/vcardx#": "vcardx",
		"http://purl.org/net/hifm/data#": "hifm",
		"http://geni-orca.renci.org/owl/topology.owl#": "orca",
		"http://datos.bcn.cl/ontologies/bcn-congress#": "bcncon",
		"http://purl.org/ontology/daia/Service/": "daiaserv",
		"http://purl.org/twc/vocab/goef#": "goef",
		"http://wiktionary.dbpedia.org/terms/": "wikterms",
		"http://purl.org/linked-data/sdmx/2009/attribute#": "sdmxa",
		"http://ontorule-project.eu/resources/steel-30#": "steel",
		"http://data.scientology.org/ns/": "sci",
		"http://stanbol.apache.org/ontology/disambiguation/disambiguation#": "dis",
		"http://purl.org/dc/dcmitype/": "dctypes",
		"http://vocab.getty.edu/tgn/": "tgn",
		"http://purl.org/cerif/frapo/": "frapo",
		"http://vocab.getty.edu/ontology#": "gvp",
		"http://open.vocab.org/terms/": "open",
		"http://escience.rpi.edu/ontology/vsto/2/0/vsto.owl#": "vsto",
		"http://lexvo.org/ontology#": "lexvo",
		"http://rdflivenews.aksw.org/ontology/": "rlno",
		"http://open-services.net/ns/crtv#": "crtv",
		"http://data.lirmm.fr/ontologies/laposte#": "laposte",
		"http://purl.org/net/wf-motifs#": "wfm",
		"http://pokedex.dataincubator.org/pkm/": "pkmn",
		"http://oecd.270a.info/dataset/": "oecd",
		"http://www.ordnancesurvey.co.uk/ontology/Datatypes.owl#": "osukdt",
		"http://opengraph.org/schema/": "ogorg",
		"http://protege.stanford.edu/plugins/owl/dc/protege-dc.owl#": "protegedc",
		"http://rdf.data-vocabulary.org/": "rich",
		"http://institutions.publicdata.eu/#": "eui",
		"http://www.lehigh.edu/~zhp2/2004/0401/univ-bench.owl#": "ub",
		"http://pleiades.stoa.org/places/": "ple",
		"http://data.kasabi.com/dataset/italy/schema/": "italy",
		"http://purl.org/olia/penn.owl#": "penn",
		"http://www.joshuajeeson.com/": "jjd",
		"http://purl.org/linked-data/sdmx/2009/dimension#": "sdmxdim",
		"http://data.eurecom.fr/ontology/reve#": "reve",
		"http://www.w3.org/2007/ont/unit#": "un",
		"http://www.w3.org/2000/10/swap/pim/contact#": "w3con",
		"http://data.press.net/ontology/asset/": "pna",
		"http://ns.nature.com/datasets/": "npgd",
		"http://purl.org/olap#": "qb4o",
		"http://www.w3.org/2001/sw/DataAccess/tests/test-dawg#": "dawgt",
		"http://purl.org/NET/mediatypes/": "mime",
		"http://ns.nature.com/graphs/": "npgg",
		"http://ns.adobe.com/photoshop/1.0/": "photoshop",
		"http://www.w3.org/2000/10/swap/reason#": "re",
		"http://linkedgeodata.org/ontology/": "lgv",
		"http://verticalsearchworks.com/ontology/": "vsw",
		"https://w3id.org/cc#": "curr",
		"http://purl.org/omapi/0.2/#": "omapi",
		"http://ns.taverna.org.uk/2010/scufl2#": "scufl2",
		"http://www.thomsonreuters.com/": "tr",
		"http://aers.data2semantics.org/resource/": "aers",
		"http://rdf.ontology2.com/vocab#": "vocab",
		"http://multimedialab.elis.ugent.be/users/samcoppe/ontologies/Premis/premis.owl#": "premis",
		"http://datos.localidata.com/def/City#": "city",
		"http://www.wsmo.org/ns/wsmo-lite#": "wl",
		"http://www.w3.org/2006/vcard/ns#": "vcard2006",
		"http://purl.org/twc/vocab/cross-topix#": "xt",
		"http://opendepot.org/reference/linked/1.0/": "oarj",
		"http://lod.gesis.org/lodpilot/ALLBUS/vocab.rdf#": "gesis",
		"http://data.totl.net/occult/": "occult",
		"http://webbox.ecs.soton.ac.uk/ns#": "webbox",
		"http://mmisw.org/ont/cf/parameter/": "cf",
		"http://ns.inria.fr/l4lod/v2/": "l4lod",
		"http://nuts.psi.enakting.org/id/BE335/doc/": "nuts",
		"http://www.openk.org/wscaim.owl#": "wsc",
		"http://www.opengis.net/def/function/geosparql/": "geof",
		"http://schemas.opengis.net/wfs/": "wfs",
		"http://www.w3.org/2004/ql#": "ql",
		"http://observedchange.com/tisc/ns#": "tisc",
		"http://purl.org/net/provenance/integrity#": "prviv",
		"http://www.w3.org/ns/r2rml#": "r2rml",
		"http://rdvocab.info/termList/RDAMediaType/": "rdamedia",
		"http://kwijibo.talis.com/vocabs/puelia#": "puelia",
		"http://standaarden.overheid.nl/owms/": "overheid",
		"http://www.openmobilealliance.org/tech/profiles/UAPROF/ccppschema-20021212#": "prf",
		"http://purl.org/library/": "lib",
		"http://vocabularies.wikipathways.org/": "wp",
		"http://swat.cse.lehigh.edu/resources/onto/aigp.owl#": "aigp",
		"http://futurios.org/fos/spec/": "fos",
		"http://purl.oclc.org/NET/lldr/ns#": "lldr",
		"http://www.w3.org/2001/XMLSchema-instance#": "xsi",
		"http://bio2rdf.org/": "bm",
		"http://rdf.muninn-project.org/ontologies/military#": "mil",
		"http://www.aifb.kit.edu/project/ld-retriever/qrl#": "qrl",
		"http://verticalsearchworks.com/ontology/synset#": "vsws",
		"http://purl.org/telmap/": "telmap",
		"http://manesht.ir/": "mohammad",
		"http://schema.org/": "sdo",
		"http://ns.rww.io/wapp#": "wapp",
		"http://purl.org/ontology/storyline/": "nsl",
		"http://rdf123.umbc.edu/ns/": "rdf123",
		"http://purl.org/locwd/schema#": "locwd",
		"http://datos.bcn.cl/ontologies/bcn-biographies#": "bcnbio",
		"http://rdf.muninn-project.org/ontologies/appearances#": "aos",
		"http://bio2rdf.org/ns/ns/ns/pubchem#": "b2rpubchem",
		"http://ecb.270a.info/class/1.0/": "ecb",
		"http://nlp2rdf.lod2.eu/schema/sso/": "sso",
		"http://datos.bcn.cl/ontologies/bcn-geographics#": "bcngeo",
		"http://swpatho.ag-nbi.de/context/meta.owl#": "swpatho",
		"http://www.enakting.org/provenance/voidp/": "voidp",
		"http://gawd.atlantides.org/terms/": "gawd",
		"http://www.bbc.co.uk/ontologies/news/": "bbc",
		"http://eunis.eea.europa.eu/rdf/species-schema.rdf#": "eunis",
		"http://psh.techlib.cz/skos/": "psh",
		"http://purl.org/ontology/ecpo#": "ecpo",
		"http://rinfo.lagrummet.se/ns/2008/11/rinfo/publ#": "rpubl",
		"http://www.w3.org/2011/http-methods#": "httpm",
		"http://geovocab.org/": "geovocab",
		"http://qudt.org/1.1/schema/qudt#": "qud",
		"http://securitytoolbox.appspot.com/stac#": "stac",
		"http://vocab.inf.ed.ac.uk/library/holdings#": "lh",
		"http://rdvocab.info/termList/RDACarrierType/": "rdacarrier",
		"http://purl.org/wf4ever/roterms#": "roterms",
		"http://securitytoolbox.appspot.com/securityAlgorithms#": "algo",
		"http://purl.org/captsolo/resume-rdf/0.2/base#": "cvbase",
		"http://www.onto-med.de/ontologies/gfo.owl#": "gfo",
		"http://purl.org/twc/vocab/datacarver#": "crv",
		"http://dcm.com/": "dcm",
		"http://www.ordnancesurvey.co.uk/ontology/SpatialRelations/v0.2/SpatialRelations.owl#": "onssprel",
		"http://www.geocontext.org/publ/2013/vocab#": "geocontext",
		"http://rdf.ebi.ac.uk/vocabulary/zooma/": "zoomaterms",
		"http://mlode.nlp2rdf.org/quranvocab#": "qvoc",
		"http://uptheasset.org/ontology#": "uta",
		"http://data.eurecom.fr/ontology/dvia#": "dvia",
		"http://escience.rpi.edu/ontology/semanteco/2/0/water.owl#": "water",
		"http://schema.wolterskluwer.de/": "wkd",
		"http://data.lirmm.fr/ontologies/poste#": "poste",
		"http://www.opengis.net/ont/sf#": "sf",
		"http://purl.org/net/pingback/": "pingback",
		"http://purl.org/cld/cdtype/": "cdtype",
		"http://data.lirmm.fr/ontologies/vdpp#": "vdpp",
		"http://data.ign.fr/ontologies/geofla#": "geofla",
		"http://en.wikipedia.org/wiki/": "wiki",
		"http://trust.utep.edu/visko/ontology/visko-operator-v3.owl#": "visko",
		"http://purl.org/webofneeds/model#": "won",
		"http://dbtropes.org/ont/": "dbtont",
		"http://ontojob.at/": "oj",
		"http://www.w3.org/ns/locn#": "locn",
		"http://www.daml.org/services/owl-s/1.2/generic/Expression.owl#": "owlse",
		"http://purl.org/vvo/ns#": "vvo",
		"http://purl.org/finlex/schema/laki/": "finlaw",
		"http://prismstandard.org/namespaces/pam/2.0/": "pam",
		"http://dati.senato.it/osr/": "osr",
		"http://purl.org/ctic/dcat#": "ds",
		"http://purl.org/ontology/ssso#": "ssso",
		"http://vocab.getty.edu/ulan/": "ulan",
		"http://www.w3.org/People/Berners-Lee/card#": "tblcard",
		"http://vocab.ox.ac.uk/ludo#": "ludo",
		"http://semantic.eurobau.com/eurobau-utility.owl#": "ebu",
		"http://eulersharp.sourceforge.net/2003/03swap/prolog#": "prolog",
		"http://rdaregistry.info/Elements/w/": "rdaw",
		"http://www.s3db.org/core#": "s3db",
		"http://vapour.sourceforge.net/vocab.rdf#": "vapour",
		"http://purl.org/provenance/w3p/w3po#": "w3po",
		"http://richard.cyganiak.de/2007/pubby/config.rdf#": "conf",
		"http://worldbank.270a.info/classification/": "wbc",
		"http://purl.org/innovation/ns#": "inno",
		"http://rdflivenews.aksw.org/resource/": "rlnr",
		"http://orion.tw.rpi.edu/~xgmatwc/refe/": "refe",
		"http://vocab.data.gov/def/fea#": "fea",
		"http://iflastandards.info/ns/fr/frbr/frbrer/": "frbrer",
		"http://ndl.go.jp/dcndl/terms/": "dcndl",
		"http://purl.org/rdfstats/stats#": "stats",
		"http://harrisons.cc/": "harrisons",
		"http://purl.org/weso/computex/ontology#": "cex",
		"http://www.essepuntato.it/2012/04/tvc/": "tvc",
		"http://users.ugent.be/~tdenies/up/": "up",
		"http://openlinksw.com/schema/attribution#": "opl",
		"http://purl.org/twc/vocab/centrifuge#": "centrifuge",
		"http://opendata.cz/infrastructure/odcleanstore/": "odcs",
		"https://vg.no/": "namespaces",
		"http://id.loc.gov/vocabulary/relators/": "mrel",
		"http://rdvocab.info/termList/RDAContentType/": "rdacontent",
		"http://www.ontologydesignpatterns.org/cp/owl/situation.owl#": "situ",
		"http://www.wikidata.org/entity/": "wikidata",
		"http://www.co-ode.org/ontologies/pizza/pizza.owl#": "pizza",
		"http://trust.utep.edu/visko/ontology/visko-view-v3.owl#": "viskov",
		"http://strdf.di.uoa.gr/ontology#": "strdf",
		"http://www.linkedthings.com/iot/": "iot",
		"http://purl.org/vocab/participation/schema#": "role",
		"http://purl.org/csm/1.0#": "csm",
		"http://purl.org/net/provenance/types#": "prvt",
		"http://www.w3.org/2006/time-entry#": "te",
		"http://purl.org/vocabularies/amalgame#": "amalgame",
		"http://worldbank.270a.info/dataset/": "worldbank",
		"http://purl.org/ontology/wi/core#": "wi",
		"http://worldbank.270a.info/property/": "wbp",
		"http://purl.org/wf4ever/roevo#": "roevo",
		"http://www.daisy.org/z3998/2012/vocab/": "daisy",
		"http://purl.org/spar/deo/": "deo",
		"http://purl.org/finlex/schema/oikeus/": "fincaselaw",
		"http://data.semanticweb.org/person/": "swperson",
		"http://iflastandards.info/ns/fr/frsad/": "frsad",
		"http://www.ontotext.com/proton/protonext#": "pext",
		"http://rdf.alchemyapi.com/rdf/v1/s/aapi-schema#": "alchemy",
		"http://cbasewrap.ontologycentral.com/vocab#": "cb",
		"http://www.loc.gov/mads/rdf/v1#": "mads",
		"http://pkgsrc.co/schema#": "pkgsrc",
		"http://data.nytimes.com/": "nyt",
		"http://eulergui.sourceforge.net/contacts.owl.n3#": "ec",
		"http://trust.utep.edu/visko/ontology/visko-operator-v3.owl#": "viskoo",
		"http://tackbp.org/2013/ontology#": "kbp",
		"http://rdvocab.info/RDARelationshipsWEMI/": "rdarel",
		"http://www.newmedialab.at/fcp/": "fcp",
		"http://vocab.resc.info/communication#": "comm",
		"http://ns.adobe.com/xap/1.0/": "xmp",
		"http://dbpedia.org/resource/Template:": "dbptmpl",
		"http://purl.org/ctic/infraestructuras/organizacion#": "ctorg",
		"http://wwwiti.cs.uni-magdeburg.de/~srahman/": "saif",
		"http://www.w3.org/ns/radion#": "radion",
		"http://data.ordnancesurvey.co.uk/ontology/spatialrelations/": "osspr",
		"http://rdvocab.info/uri/schema/FRBRentitiesRDA/": "rdafrbr",
		"http://vocab.ox.ac.uk/camelot#": "camelot",
		"http://purl.org/vocab/participation/schema#": "part",
		"http://purl.org/linked-data/api/vocab#": "api",
		"http://ontology.ip.rm.cnr.it/ontologies/DOLCE-Lite#": "dl",
		"http://bio2rdf.org/pubmed_vocabulary:": "pubmed",
		"http://www.ogbd.fr/2012/ontologie#": "ogbd",
		"http://purl.org/wf4ever/wf4ever#": "wf4ever",
		"http://purl.org/twc/vocab/vsr/graffle#": "graffle",
		"http://rdvocab.info/Elements/": "rdag1",
		"http://rdvocab.info/ElementsGr3/": "rdag3",
		"http://www.dbs.cs.uni-duesseldorf.de/RDF/relational#": "rdb",
		"http://purl.org/vocab/lifecycle/schema#": "lcy",
		"http://www.agls.gov.au/agls/terms/": "agls",
		"http://purl.org/biotop/biotop.owl#": "biotop",
		"http://www.ontologydesignpatterns.org/cp/owl/informationrealization.owl#": "infor",
		"http://purl.org/voc/vrank#": "vrank",
		"http://www.wsmo.org/ns/wsmo-lite#": "wsl",
		"http://purl.org/spar/pso/": "pso",
		"http://purl.org/vocab/participation/schema#": "particip",
		"http://bibframe.org/vocab/": "bibframe",
		"http://jicamaro.info/mp#": "mp",
		"http://ns.inria.fr/emoca#": "emotion",
		"http://purl.org/linked-data/sdmx/2009/dimension#": "sdmxd",
		"http://lod.b3kat.de/title/": "bsb",
		"http://rdaregistry.info/Elements/m/": "rdam",
		"http://purl.org/ontology/wo/": "wlo",
		"http://rdf.data-vocabulary.org/rdf.xml#": "rdfdata",
		"http://dbpedia.org/ontology/Stream/": "stream",
		"http://dbpedia.org/resource/Template:": "dbt",
		"http://rdaregistry.info/Elements/c/": "rdac",
		"http://www.who.int/vocab/ontology#": "who",
		"http://purl.org/configurationontology#": "cold",
		"http://data.ordnancesurvey.co.uk/ontology/geometry/": "osgeom",
		"http://purl.org/datanode/ns/": "dn",
		"http://genomequest.com/": "gq",
		"http://www.ontotext.com/proton/protontop#": "ptop",
		"http://openlad.org/vocab#": "olad",
		"http://purl.org/twc/vocab/aapi-schema#": "twaapi",
		"http://vocab.data.gov/def/drm#": "drm",
		"http://purl.oclc.org/NET/mvco.owl#": "mvco",
		"http://ontology.it/itsmo/v1#": "itsmo",
		"http://observedchange.com/moac/ns#": "moac",
		"http://purl.org/dqm-vocabulary/v1/dqm#": "dqm",
		"http://purl.org/spar/doco/": "doco",
		"http://ns.aksw.org/scms/annotations/": "scms",
		"http://www.w3.org/2004/delta#": "delta",
		"http://archdesc.info/archEvent#": "archdesc",
		"http://opendata.caceres.es/def/ontomunicipio#": "om",
		"http://ontologycentral.com/2010/05/cb/vocab#": "cbase",
		"http://purl.org/gc/": "gnvc",
		"http://nidm.nidash.org/": "nidm",
		"http://purl.oclc.org/POIS/vcblr#": "pois",
		"http://vocab.lenka.no/geo-deling#": "geod",
		"http://vocab.deri.ie/csp#": "csp",
		"http://purl.org/olia/system.owl#": "oliasystem",
		"http://rdaregistry.info/Elements/u/": "rdau",
		"http://vocab.ox.ac.uk/projectfunding#": "ox",
		"http://purl.org/spar/biro/": "biro",
		"http://penis.to/#": "penis",
		"http://ns.inria.fr/emoca#": "emoca",
		"http://purl.org/ontology/cosmo#": "cosmo",
		"http://www.semanticweb.org/asow/ontologies/2013/9/untitled-ontology-36#": "mocanal",
		"http://data.ordnancesurvey.co.uk/ontology/admingeo/": "osadm",
		"http://www.ontologydesignpatterns.org/ont/lmm/LMM_L1.owl#": "lmm1",
		"http://ns.inria.fr/nicetag/2010/09/09/voc#": "ntag",
		"http://www.ordnancesurvey.co.uk/ontology/Topography/v0.1/Topography.owl#": "ostop",
		"http://purl.org/dc/terms/": "purl",
		"http://reference.data.gov.uk/def/organogram/": "odv",
		"http://kmm.lboro.ac.uk/ecos/1.0#": "ecos",
		"http://purl.org/viso/": "viso",
		"http://purl.org/spar/datacite/": "dcite",
		"http://www.ontologydesignpatterns.org/ont/dul/ontopic.owl#": "ontopic",
		"http://www.icane.es/opendata/vocab#": "icane",
		"http://www.ontologydesignpatterns.org/schemas/cpannotationschema.owl#": "cpa",
		"http://purl.org/ontology/paia#": "paia",
		"http://purl.org/acco/ns#": "accom",
		"http://dx.deepcarbon.net/": "dcoid",
		"http://rdf.geospecies.org/ont/geospecies#": "geosp",
		"http://vocab.deri.ie/odapp#": "odapp",
		"http://sw-portal.deri.org/ontologies/swportal#": "swpo",
		"http://www.ebsemantics.net/gastro#": "gastro",
		"http://purl.org/LiMo/0.1/": "limoo",
		"http://www.oegov.org/core/owl/cc#": "oecc",
		"http://linkedscience.org/lsc/ns#": "lsc",
		"http://www.ontologydesignpatterns.org/ont/lmm/LMM_L2.owl#": "lmm2",
		"http://iflastandards.info/ns/muldicat#": "muldicat",
		"http://www.daml.org/2001/09/countries/iso-3166-ont#": "coun",
		"http://rdf.myexperiment.org/ontologies/base/": "meb",
		"http://www.ontologydesignpatterns.org/ont/dul/IOLite.owl#": "iol",
		"http://www.telegraphis.net/ontology/measurement/measurement#": "msr",
		"http://mged.sourceforge.net/ontologies/MGEDOntology.owl#": "mged",
		"http://data.lirmm.fr/ontologies/passim#": "passim",
		"http://eprints.org/ontology/": "ep",
		"http://purl.org/ctic/empleo/oferta#": "emp",
		"http://purl.org/voc/ling/": "ling",
		"http://purl.org/spar/pwo/": "pwo",
		"http://purl.org/lex/cz#": "lexcz",
		"http://www.holygoat.co.uk/owl/redwood/0.1/tags/": "hlygt",
		"http://ogp.me/ns/article#": "article",
		"http://www.telegraphis.net/ontology/measurement/quantity#": "quty",
		"http://www.w3.org/XML/1998/namespace/": "xml",
		"http://rdf.geospecies.org/methods/observationMethod#": "obsm",
		"http://dbpedia.org/resource/": "dbpr",
		"http://www.lingvoj.org/ontology#": "lingvo",
		"http://idi.fundacionctic.org/cruzar/turismo#": "turismo",
		"http://doc.metalex.eu/id/": "mds",
		"http://doc.metalex.eu/bwb/ontology/": "bwb",
		"http://www.gsi.dit.upm.es/ontologies/onyx/ns#": "onyx",
		"http://www.lingvoj.org/semio#": "semio",
		"http://purl.org/swan/2.0/discourse-relationships/": "dr",
		"http://tw.rpi.edu/schema/": "tw",
		"http://purl.org/NET/ordf/": "ordf",
		"http://rdf.muninn-project.org/ontologies/graves#": "graves",
		"http://rdfs.org/sioc/types#": "tsioc",
		"http://rdaregistry.info/Elements/e/": "rdae",
		"http://courseware.rkbexplorer.com/ontologies/courseware#": "crsw",
		"http://vocab.deri.ie/raul#": "raul",
		"http://gadm.geovocab.org/ontology#": "gadm",
		"http://purl.org/ctic/sector-publico/elecciones#": "elec",
		"http://openprovenance.org/ontology#": "oprovo",
		"http://rdf.myexperiment.org/ontologies/snarm/": "snarm",
		"http://www.researchspace.org/ontology/": "rso",
		"http://spitfire-project.eu/ontology/ns/": "spt",
		"http://edgarwrap.ontologycentral.com/vocab/edgar#": "edgar",
		"http://vocab.deri.ie/tao#": "tao",
		"http://bihap.kb.gov.tr/ontology/": "bihap",
		"http://databugger.aksw.org/ns/core#": "tddo",
		"http://openprovenance.org/model/opmo#": "opmo",
		"http://www.ontologydesignpatterns.org/cp/owl/sequence.owl#": "seq",
		"http://www.geonames.org/ontology/mappings/": "gnm",
		"http://rdaregistry.info/Elements/a/": "rdaa",
		"http://purl.org/co/": "coll",
		"http://erlangen-crm.org/current/": "ecrm",
		"http://dbpedia.org/resource/": "laabs",
		"http://purl.org/ontomedia/ext/common/being#": "being",
		"http://www.ontologydesignpatterns.org/cp/owl/participation.owl#": "odpart",
		"http://www.ontologydesignpatterns.org/cp/owl/timeindexedsituation.owl#": "tis",
		"http://linkedmultimedia.org/sparql-mm/ns/1.0.0/function#": "mm",
		"http://contextus.net/ontology/ontomedia/ext/common/trait#": "trait",
		"http://data.globalchange.gov/gcis.owl#": "gcis",
		"http://environment.data.gov.au/def/op#": "op",
		"http://rdaregistry.info/Elements/i/": "rdai",
		"http://kai.uni-kiel.de/": "kai",
		"http://www.opengis.net/ont/geosparql#": "geosparql",
		"http://sw.opencyc.org/concept/": "opencyc",
		"http://jmvanel.free.fr/ontology/software_applications.n3#": "app",
		"http://aims.fao.org/aos/geopolitical.owl#": "geop",
		"http://xxefe.de/": "erce",
		"http://clarin.eu/cmd#": "cmd",
		"http://purl.org/twc/vocab/opendap#": "od",
		"http://www.w3.org/2001/sw/DataAccess/tests/test-manifest#": "mt",
		"http://eur-lex.publicdata.eu/ontology/": "eurlex",
		"http://www.lexinfo.net/ontology/2.0/lexinfo#": "lexinfo",
		"http://www.provbook.org/ns/#": "bk",
		"http://dbpedia.org/resource/Category:": "dbrc",
		"http://www.kanzaki.com/ns/dpd#": "dpd",
		"http://rdfs.org/sioc/services#": "siocserv",
		"http://purl.org/net/evident#": "evident",
		"http://www.ft.com/ontology/content/": "ftcontent",
		"http://aims.fao.org/aos/agrovoc/": "asgv",
		"http://www.w3.org/2008/05/skos#": "skos08",
		"http://sw.deri.org/2006/07/location/loc#": "location",
		"http://purl.org/net/VideoGameOntology#": "vgo",
		"http://contsem.unizar.es/def/sector-publico/pproc#": "pproc",
		"http://purl.org/provone#": "provone",
		"http://def.seegrid.csiro.au/isotc211/iso19115/2003/lineage#": "li",
		"http://lod.taxonconcept.org/ontology/p01/Mammalia/index.owl#": "mammal",
		"http://art.uniroma2.it/ontologies/lime#": "lime",
		"http://www.mobile.com/model/": "my",
		"http://contsem.unizar.es/def/sector-publico/contratacion#": "contsem",
		"http://www.openarchives.org/OAI/2.0/": "defns",
		"http://vocab.linkeddata.es/datosabiertos/def/urbanismo-infraestructuras/callejero#": "cjr",
		"http://data.posccaesar.org/rdl/": "rdl",
		"http://vocab.sindice.net/csv/": "csv",
		"http://www.w3.org/TR/2003/PR-owl-guide-20031209/wine#": "vin",
		"http://wordnet-rdf.princeton.edu/ontology#": "wno",
		"http://purl.org/net/hdlipcores/ontology/soc#": "soc",
		"https://w3id.org/legal_form#": "lfov",
		"http://www.co-ode.org/roberts/travel.owl#": "travel",
		"http://www.language-archives.org/OLAC/1.1/": "olac11",
		"http://fao.270a.info/dataset/": "fao",
		"http://groundedannotationframework.org/": "gaf",
		"http://purl.org/procurement/public-contracts#": "pco",
		"http://www.openlinksw.com/ontology/products#": "oplprod",
		"http://purl.obolibrary.org/obo/bco.owl#": "bco",
		"http://agrinepaldata.com/": "agrd",
		"http://www.language-archives.org/OLAC/1.0/": "olac",
		"http://frb.270a.info/dataset/": "frb",
		"http://id.loc.gov/vocabulary/iso639-1/": "language",
		"http://omdoc.org/ontology/": "omdoc",
		"http://purl.oreilly.com/ns/meta/": "metadata",
		"http://origins.link/": "origins",
		"http://dbtune.org/musicbrainz/resource/instrument/": "mb",
		"http://vocab.linkeddata.es/datosabiertos/def/urbanismo-infraestructuras/transporte#": "estrn",
		"http://purl.org/linked-data/api/vocab#": "lda",
		"http://www.loc.gov/zing/srw/": "sru",
		"http://purl.org/imbi/ru-meta.owl#": "ru",
		"http://purl.org/net/vgo#": "videogame",
		"http://webofcode.org/wfn/call:": "call",
		"http://semweb.mmlab.be/ns/oh#": "oh",
		"http://ontologycentral.com/2009/01/eurostat/ns#": "estatwrap",
		"http://www.ensias.ma/": "koly",
		"http://rdf.onisep.fr/resource/": "onisep",
		"http://vocab.linkeddata.es/datosabiertos/def/sector-publico/territorio#": "esadm",
		"http://rdf.freebase.com/ns/location/geocode/": "fbgeo",
		"http://www.openlinksw.com/ontology/licenses#": "opllic",
		"http://linkedmultimedia.org/sparql-mm/functions/temporal#": "mmt",
		"http://lod.taxonconcept.org/ses/": "ses",
		"http://www.w3.org/ns/odrl/2/": "odrl",
		"http://www.openarchives.org/OAI/2.0/friends/": "friends",
		"http://purl.org/olia/stanford.owl#": "stanford",
		"http://www.clarin.eu/cmd/": "cmdi",
		"http://ldf.fi/void-ext#": "vext",
		"http://iserve.kmi.open.ac.uk/ns/msm#": "msm",
		"http://www.linked2safety-project.eu/properties/": "l2sp",
		"http://purl.org/legal_form/vocab#": "lofv",
		"http://vocab.fusepool.info/fp3#": "fp3",
		"http://vocab.deri.ie/sad#": "sad",
		"http://babelnet.org/2.0/": "babelnet",
		"http://owlrep.eu01.aws.af.cm/fridge#": "of",
		"http://ns.taverna.org.uk/2012/tavernaprov/": "tavprov",
		"http://vocab-ld.org/vocab/static-ld#": "static",
		"http://purl.org/twc/vocab/pvcs#": "pvcs",
		"http://www.example.org/lexicon#": "lexicon",
		"http://webofcode.org/wfn/": "wfn",
		"http://ontology.irstea.fr/": "irstea",
		"http://ontology.irstea.fr/weather/ontology#": "irsteaont",
		"http://uri4uri.net/vocab#": "uri4uri",
		"http://www.employee.com/data#": "employee",
		"http://www.ontotext.com/proton/protonkm#": "pkm",
		"http://openskos.org/xmlns#": "openskos",
		"http://code-research.eu/ontology/visual-analytics#": "va",
		"http://www.loc.gov/zing/srw/diagnostic/": "diag",
		"http://imf.270a.info/dataset/": "imf",
		"http://salt.semanticauthoring.org/ontologies/sro#": "sro",
		"https://w3id.org/navigation_menu#": "navm",
		"http://www.opengis.net/kml/2.2#": "kml",
		"http://www.ipaw.info/ns/picaso#": "pic",
		"http://rdf.muninn-project.org/ontologies/jp1/": "jp1",
		"http://rdfunit.aksw.org/ns/core#": "ruto",
		"http://purl.org/net/opmv/types/xslt#": "xslopm",
		"http://clarin.eu/fcs/resource#": "fcs",
		"http://www.neclimateus.org/": "nxs",
		"http://spdx.org/rdf/terms#": "spdx",
		"http://www.openlinksw.com/ontology/acl#": "oplacl",
		"http://data.ign.fr/def/topo#": "topo",
		"http://lod.geodan.nl/vocab/bag#": "bag",
		"http://lodlaundromat.org/ontology/": "llo",
		"http://agrinepaldata.com/vocab/": "agro",
		"http://vocab.org/whisky/terms/": "whisky",
		"http://semweb.mmlab.be/ns/odapps#": "odapps",
		"http://ontologi.es/doap-bugs#": "dbug",
		"http://vocab.fusepool.info/fam#": "fam",
		"http://lodlaundromat.org/resource/": "ll",
		"http://simile.mit.edu/2003/10/ontologies/vraCore3#": "vra",
		"http://purl.org/vocabularies/princeton/wn30/": "wn30",
		"http://ontoview.org/schema/unspsc/1#": "unspsc",
		"http://advene.org/ns/cinelab/": "cl",
		"http://purl.org/rvl/": "rvl",
		"http://spi-fm.uca.es/spdef/models/genericTools/wikim/1.0#": "wikim",
		"http://elite.polito.it/ontologies/dogont.owl#": "dogont",
		"http://vocab.gtfs.org/terms#": "gtfs",
		"http://purl.org/ontology/holding#": "holding",
		"http://abs.270a.info/dataset/": "abs",
		"http://dbpedia.org/resource/Category:": "dbcat",
		"http://purl.org/net/po#": "plo",
		"http://lodlaundromat.org/metrics/ontology/": "llm",
		"http://www.contextdatacloud.org/resource/": "cdc",
		"http://rdfs.org/ns/void-ext#": "voidext",
		"http://explain.z3950.org/dtd/2.0/": "zr",
		"http://resource.geosciml.org/ontology/timescale/thors#": "thors",
		"http://www.w3.org/2013/ShEx/ns#": "shex",
		"http://infra.clarin.eu/cmd/": "cmdm",
		"http://www.w3.org/2004/03/trix/rdfg-1/": "trig",
		"http://rdf.muninn-project.org/ontologies/naval#": "naval",
		"http://def.seegrid.csiro.au/isotc211/iso19156/2011/sampling#": "sam",
		"http://www.openlinksw.com/ontology/restrictions#": "oplres",
		"http://metadataregistry.org/uri/schema/RDARelationshipsGR2/": "rdarel2",
		"http://uis.270a.info/dataset/": "uis",
		"http://def.seegrid.csiro.au/isotc211/iso19115/2003/dataquality#": "dq",
		"http://vocab.linkeddata.es/datosabiertos/def/turismo/alojamiento#": "esaloj",
		"http://purl.oclc.org/NET/ssnx/qu/qu#": "qu",
		"http://sig.uw.edu/fma#": "fma",
		"http://merlin.phys.uni.lodz.pl/onto/physo/physo.owl#": "physo",
		"http://mappings.roadmap.org/": "roadmap",
		"http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#": "ebucore",
		"http://spi-fm.uca.es/spdef/models/genericTools/vmm/1.0#": "vmm",
		"http://purl.org/biodiversity/taxon/": "taxon",
		"http://def.seegrid.csiro.au/isotc211/iso19108/2002/temporal#": "tm",
		"http://bis.270a.info/dataset/": "bis",
		"http://upload.wikimedia.org/wikipedia/commons/f/f6/": "wikimedia",
		"http://ns.cerise-project.nl/energy/def/cim-smartgrid#": "smg",
		"http://www.ontotext.com/proton/protonsys#": "psys",
		"http://purl.org/xapi/ontology#": "xapi",
		"https://ns.eccenca.com/": "ecc",
		"http://vocab.linkeddata.es/datosabiertos/def/urbanismo-infraestructuras/callejero#": "escjr",
		"http://purl.org/geovocamp/ontology/geovoid/": "geovoid",
		"http://reference.data.gov.uk/def/parliament/": "parl",
		"http://def.seegrid.csiro.au/isotc211/iso19109/2005/feature#": "gf",
		"http://www.ics.forth.gr/isl/VoIDWarehouse/VoID_Extension_Schema.owl#": "voidwh",
		"http://www.telegraphis.net/ontology/geography/geography#": "geos",
		"http://rdvocab.info/ElementsGr2/": "rdag2",
		"http://purl.org/net/wf4ever/ro#": "wro",
		"http://www.essepuntato.it/2013/03/cito-functions#": "citof",
		"http://salt.semanticauthoring.org/ontologies/sao#": "sao",
		"http://kmi.open.ac.uk/projects/smartproducts/ontologies/food.owl#": "spfood",
		"http://data.posccaesar.org/ilap/": "ilap",
		"http://www.lexinfo.net/lmf#": "lmf",
		"http://ns.bergnet.org/tac/0.1/triple-access-control#": "tac",
		"http://securitytoolbox.appspot.com/securityMain#": "security",
		"http://www.essepuntato.it/2008/12/pattern#": "pattern",
		"http://lod.taxonconcept.org/ontology/sci_people.owl#": "scip",
		"http://nerd.eurecom.fr/ontology#": "nerd",
		"http://iserve.kmi.open.ac.uk/ns/hrests#": "hr",
		"http://lemon-model.net/oils#": "oils",
		"http://semweb.mmlab.be/ns/stoptimes#": "st",
		"http://deductions-software.com/ontologies/forms.owl.ttl#": "form",
		"http://def.seegrid.csiro.au/isotc211/iso19115/2003/extent#": "ext",
		"http://data.lirmm.fr/ontologies/oan/": "oan",
		"http://data.press.net/ontology/classification/": "pnc",
		"http://purl.org/spar/scoro/": "scoro",
		"http://www.w3.org/ns/shacl#": "sh",
		"http://collection.britishmuseum.org/id/ontology/": "bmo",
		"http://ontoloji.galaksiya.com/vocab/": "galaksiya",
		"http://def.seegrid.csiro.au/isotc211/iso19103/2005/basic#": "basic",
		"http://www.mico-project.eu/ns/platform/1.0/schema#": "mico",
		"http://www.bbc.co.uk/ontologies/provenance/": "bbcprov",
		"http://reegle.info/schema#": "reegle",
		"http://swat.cse.lehigh.edu/onto/univ-bench.owl#": "sbench",
		"http://sws.ifi.uio.no/vocab/npd#": "npdv",
		"http://purl.org/hpi/guo#": "guo",
		"http://data.press.net/ontology/tag/": "pnt",
		"http://data.press.net/ontology/identifier/": "pni",
		"http://www.isocat.org/datcat/": "isocat",
		"http://def.seegrid.csiro.au/isotc211/iso19107/2003/geometry#": "gm",
		"http://semweb.mmlab.be/ns/linkedconnections#": "lc",
		"http://resource.geosciml.org/ontology/timescale/gts#": "gts",
		"http://bibliograph.net/schemas/": "bgn",
		"http://purl.org/NET/c4dm/keys.owl#": "keys",
		"http://def.seegrid.csiro.au/isotc211/iso19150/-2/2012/basic#": "h2o",
		"http://purl.org/healthcarevocab/v1#": "dicom",
		"http://linkedmultimedia.org/sparql-mm/ns/1.0.0/function#": "mmf",
		"http://purl.oclc.org/NET/ssnx/meteo/aws#": "aws",
		"http://www.samos.gr/ontologies/helpdeskOnto.owl#": "hdo",
		"http://linkedspending.aksw.org/ontology/": "lso",
		"http://ocean-data.org/schema/": "odo",
		"http://wordnet-rdf.princeton.edu/wn31/": "wn31",
		"http://deductions-software.com/ontologies/doas.owl.ttl#": "doas",
		"http://rdfs.co/bevon/": "bevon",
		"http://purl.oclc.org/NET/ldr/ns#": "ldr",
		"http://rdfdata.eionet.europa.eu/ramon/ontology/": "ramon",
		"http://purl.org/ontology/stories/": "stories",
		"http://securitytoolbox.appspot.com/MASO#": "maso",
		"http://imi.ipa.go.jp/ns/core/210#": "ic",
		"http://spi-fm.uca.es/spdef/models/deployment/spcm/1.0#": "spcm",
		"http://ontologi.es/doap-changeset#": "dcs",
		"http://spi-fm.uca.es/spdef/models/deployment/swpm/1.0#": "swpm",
		"http://musicbrainz.org/ns/mmd-1.0#": "mmd",
		"http://www.openlinksw.com/schemas/crunchbase#": "oplcb",
		"http://linkedspending.aksw.org/instance/": "ls",
		"http://data.ign.fr/def/ignf#": "ignf",
		"http://purl.org/oslo/ns/localgov#": "oslo",
		"http://bio2rdf.org/ns/kegg#": "kegg",
		"http://www.openlinksw.com/schemas/cert#": "oplcert",
		"http://opendata.caceres.es/def/ontosemanasanta#": "oss",
		"http://open-multinet.info/ontology/omn-lifecycle#": "omnlife",
		"http://www.purl.org/limo-ontology/limo#": "limo",
		"http://paul.staroch.name/thesis/SmartHomeWeather.owl#": "shw",
		"http://privatealpha.com/ontology/certification/1#": "acrt",
		"http://creativecommons.org/ns#": "ccrel",
		"http://xlime-project.org/vocab/": "xlime",
		"http://www.bbc.co.uk/ontologies/coreconcepts/": "bbccore",
		"http://www.nexml.org/2009/": "nex",
		"http://www.w3.org/ns/activitystreams#": "as",
		"http://purl.org/linkedpolitics/vocabulary/eu/plenary/": "lpeu",
		"http://linkedwidgets.org/statisticalwidget/ontology/": "sw",
		"http://www.bbc.co.uk/ontologies/cms/": "bbccms",
		"http://bg.dbpedia.org/resource/\u041a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u044f:": "bgcat",
		"http://vocabularies.wikipathways.org/gpml#": "gpml",
		"http://lod.xdams.org/reload/oad/": "oad",
		"http://bio2rdf.org/affymetrix_vocabulary:": "affymetrix",
		"http://spi-fm.uca.es/spdef/models/genericTools/itm/1.0#": "itm",
		"http://data.archiveshub.ac.uk/def/": "locah",
		"http://purl.org/net/lio#": "lio",
		"http://gov.genealogy.net/ontology.owl#": "gov",
		"http://ontologi.es/doap-deps#": "deps",
		"http://purl.org/dsnotify/vocab/eventset/": "dsn",
		"http://pictogram.tokyo/vocabulary#": "hp",
		"http://schema.theodi.org/odrs#": "odrs",
		"http://loted.eu/ontology#": "loted",
		"http://www.wordnet.dk/owl/instance/2009/03/instances/": "dannet",
		"http://hospee.org/ontologies/dpc/": "dpc",
		"http://schema.geolink.org/": "gl",
		"http://purl.org/NET/cpan-uri/terms#": "cpant",
		"http://contextus.net/ontology/ontomedia/misc/date#": "date",
		"http://purl.org/vocommons/bv#": "bv",
		"https://project-open-data.cio.gov/v1.1/schema/#": "pod",
		"http://www.lingvoj.org/olca#": "olca",
		"http://spektrum.ctu.cz/ontologies/radio-spectrum#": "rs",
		"http://data.rvdata.us/": "rvdata",
		"http://vocab.ub.uni-leipzig.de/bibrm/": "bibrm",
		"http://lemon-model.net/lexica/uby/": "lemonuby",
		"http://www.openlinksw.com/ontology/market#": "oplmkt",
		"http://www.geneontology.org/formats/oboInOwl#": "oboinowl",
		"http://rdaregistry.info/termList/CollTitle/": "rdacct",
		"http://www.w3.org/opengov#": "opengov",
		"http://rdaregistry.info/termList/RDAMediaType/": "rdamt",
		"http://rdf.muninn-project.org/ontologies/religion#": "religion",
		"http://yovisto.com/": "yo",
		"http://ontologydesignpatterns.org/ont/wikipedia/d0.owl#": "d0",
		"http://rdaregistry.info/termList/gender/": "rdagd",
		"http://eatld.et.tu-dresden.de/rmo#": "rmo",
		"http://schema.geolink.org/": "ecgl",
		"http://datos.bne.es/resource/": "bner",
		"http://rdaregistry.info/termList/modeIssue/": "rdami",
		"http://data.worldbank.org/": "wb",
		"http://infotech.nitk.ac.in/research-scholars/sakthi-murugan-r/": "sakthi",
		"http://rdaregistry.info/termList/RDAPolarity/": "rdapo",
		"http://www.w3.org/ns/pim/space#": "pim",
		"http://www.openlinksw.com/ontology/ecrm#": "oplecrm",
		"http://clirio.kaerle.com/clirio.owl#": "clirio",
		"http://linkedwidgets.org/statisticaldata/ontology/": "lsd",
		"http://schemas.capita-libraries.co.uk/2015/acl/schema#": "caplibacl",
		"http://linked.opendata.cz/ontology/ldvm/": "ldvm",
		"http://www.kinjal.com/condition:": "condition",
		"http://www.semanticweb.org/ontologies/2008/11/OntologySecurity.owl#": "ontosec",
		"http://purl.org/NET/seas#": "seas",
		"http://schema.geolink.org/dev/view/": "glview",
		"http://teste.com/": "ljkl",
		"http://docs.oasis-open.org/ns/search-ws/xcql#": "xcql",
		"http://bg.dbpedia.org/property/": "bgdbp",
		"http://rdaregistry.info/termList/frequency/": "rdafr",
		"http://purl.org/vocommons/bridge#": "bridge",
		"http://semweb.mmlab.be/ns/dicera#": "dicera",
		"http://rdaregistry.info/termList/TacNotation/": "rdaftn",
		"http://rdaregistry.info/termList/emulsionMicro/": "rdaemm",
		"http://vocab.linkeddata.es/datosabiertos/def/comercio/tejidoComercial#": "escom",
		"http://rdaregistry.info/termList/RDAColourContent/": "rdacc",
		"http://registry.info/termList/recMedium/": "rdarm",
		"http://schema.geolink.org/view/": "ecglview",
		"http://vocab.linkeddata.es/datosabiertos/def/urbanismo-infraestructuras/equipamiento#": "esequip",
		"http://vidont.org/": "vidont",
		"http://rdaregistry.info/termList/RDACarrierType/": "rdact",
		"http://rdaregistry.info/termList/fontSize/": "rdafs",
		"http://rdf.ebi.ac.uk/terms/chembl#": "chembl",
		"http://www.ics.forth.gr/isl/oae/core#": "oae",
		"http://rdaregistry.info/termList/RDABaseMaterial/": "rdabm",
		"http://open-multinet.info/ontology/omn-federation#": "omnfed",
		"http://ns.lucid-project.org/revision/": "lcdr",
		"http://docs.oasis-open.org/ns/xri/xrd-1.0#": "xrd",
		"http://dati.cdec.it/lod/shoah/": "shoah",
		"http://filmontology.org/ontology/1.0/": "foo",
		"http://vocab.linkeddata.es/datosabiertos/def/hacienda/presupuestos#": "espresup",
		"http://linkedwidgets.org/ontologies/": "lw",
		"http://rdaregistry.info/termList/groovePitch/": "rdagrp",
		"http://data.europa.eu/esco/model#": "esco",
		"http://rdaregistry.info/termList/RDAContentType/": "rdaco",
		"http://rdaregistry.info/termList/trackConfig/": "rdatc",
		"http://www.ics.forth.gr/isl/oncm/core#": "onc",
		"http://rdaregistry.info/termList/noteForm/": "rdafnv",
		"http://purl.org/twc/vocab/conversion/": "c9d",
		"http://www.w3.org/2001/xml-events/": "ev",
		"http://sensormeasurement.appspot.com/ont/home/homeActivity#": "ha",
		"https://vocab.eccenca.com/revision/": "eccrev",
		"http://rdaregistry.info/termList/RDAReductionRatio/": "rdarr",
		"http://rdaregistry.info/termList/grooveWidth/": "rdagw",
		"http://rdaregistry.info/termList/FormNoteMus/": "rdafnm",
		"http://rdaregistry.info/termList/MusNotation/": "rdafmn",
		"http://purl.org/NET/ssnext/electricmeters#": "emtr",
		"http://omerxi.com/ontologies/core.owl.ttl#": "oxi",
		"http://bg.dbpedia.org/resource/": "bgdbr",
		"http://intellimind.io/ns/company#": "company",
		"http://rdaregistry.info/termList/statIdentification/": "rdasoi",
		"http://rdaregistry.info/termList/soundCont/": "rdasco",
		"http://wifo5-04.informatik.uni-mannheim.de/eurostat/resource/eurostat/": "eurostat",
		"http://rdaregistry.info/termList/typeRec/": "rdatr",
		"https://onlinesocialmeasures.wordpress.com/": "owsom",
		"http://ddbj.nig.ac.jp/ontologies/sequence#": "insdc",
		"http://www.w3.org/2000/10/swap/grammar/bnf#": "bnf",
		"http://www.semanticweb.org/parthasb/ontologies/2014/6/vacseen1/": "vacseen1",
		"http://rdaregistry.info/termList/prodTactile/": "rdapmt",
		"http://www.irit.fr/recherches/MELODI/ontologies/SAN.owl#": "san",
		"http://purl.org/vocab/changeset/schema#": "changeset",
		"http://rdaregistry.info/termList/bookFormat/": "rdabf",
		"http://www.sensormeasurement.appspot.com/ont/transport/traffic#": "traffic",
		"http://purl.org/vocab/cpsv#": "cpsv",
		"http://babelnet.org/rdf/": "bn",
		"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#": "ncit",
		"http://w3id.org/verb/": "verb",
		"http://fr.dbpedia.org/property/": "fdbp",
		"http://purl.org/NET/lindt#": "lindt",
		"http://lawd.info/ontology/": "lawd",
		"http://tadirah.dariah.eu/vocab/": "tadirah",
		"http://www.google.com/": "beth",
		"http://www.linklion.org/lden/": "lden",
		"http://intelleo.eu/ontologies/user-model/ns/": "um",
		"http://www.ifomis.org/bfo/1.1#": "bfo",
		"http://biohackathon.org/resource/faldo#": "faldo",
		"http://hadatac.org/ont/hasneto#": "hasneto",
		"http://www.essepuntato.it/2013/10/vagueness/": "vag",
		"http://hadatac.org/ont/vstoi#": "vstoi",
		"http://purl.org/saws/ontology#": "saws",
		"http://www.openlinksw.com/ontology/webservices#": "webservice",
		"http://semweb.mmlab.be/ns/rml#": "rml",
		"http://rdf-vocabulary.ddialliance.org/phdd#": "phdd",
		"http://www.w3.org/XML/1998/namespace/": "lmx",
		"http://server.ubiqore.com/ubiq/core#": "ubiq",
		"https://decision-ontology.googlecode.com/svn/trunk/decision.owl#": "decision",
		"http://td5.org/#": "td5",
		"http://rdaregistry.info/Elements/z/": "rdaz",
		"http://www.openlinksw.com/ontology/faq#": "faq",
		"http://qudt.org/schema/quantity#": "quantity",
		"http://mex.aksw.org/mex-core#": "mexcore",
		"http://vocab.linkeddata.es/datosabiertos/def/urbanismo-infraestructuras/direccionPostal#": "esdir",
		"http://mbgd.genome.ad.jp/owl/mbgd.owl#": "mbgd",
		"http://rdfns.org/d2d/": "d2d",
		"http://purl.org/voc/uneskos#": "uneskos",
		"http://www.ics.forth.gr/isl/MarineTLO/v4/marinetlo.owl#": "mtlo",
		"http://reactionontology.org/piero/": "piero",
		"http://www.linklion.org/ontology#": "llont",
		"http://vocabularies.bridgedb.org/ops#": "ops",
		"http://www.openlinksw.com/ontology/odbc#": "odbc",
		"http://comicmeta.org/cbo/": "cbo",
		"http://mex.aksw.org/mex-algo#": "mexv",
		"http://rdaregistry.info/termList/rofer/": "rofer",
		"http://schema.intellimind.ns/symbology#": "imind",
		"http://www.ontologydesignpatterns.org/ont/framenet/abox/": "fnabox",
		"http://www.bbc.co.uk/ontologies/creativework/": "cwork",
		"http://snomed.info/sct/": "sct",
		"http://purl.org/eis/vocab/daq#": "daq",
		"http://www.omg.org/spec/FIGI/GlobalInstrumentIdentifiers/": "figigii",
		"http://purl.org/essglobal/vocab/v1.0/": "essglobal",
		"http://www.purl.org/net/remetca#": "remetca",
		"http://www.mygrid.org.uk/ontology/JERMOntology#": "jerm",
		"http://www.eclap.eu/schema/eclap/": "eclap",
		"http://rdaregistry.info/termList/rofch/": "rofch",
		"http://mex.aksw.org/mex-algo#": "mexalgo",
		"http://bsym.bloomberg.com/sym/": "bsym",
		"http://sa.aktivespace.org/ontologies/aktivesa#": "aktivesa",
		"http://purl.org/opdm/refrigerator#": "ofrd",
		"http://purl.oclc.org/NET/ssnx/cf/cf-feature#": "cff",
		"http://purl.org/net/cartCoord#": "cart",
		"http://rdaregistry.info/termList/rofem/": "rofem",
		"http://vocab.resc.info/incident#": "incident",
		"http://vocab.linkeddata.es/datosabiertos/def/urbanismo-infraestructuras/aparcamiento#": "esapar",
		"http://www.conjecto.com/ontology/2015/lheo#": "lheo",
		"https://raw.githubusercontent.com/airs-linked-data/lov/latest/src/airs_vocabulary.ttl#": "airs",
		"http://onto.dm2e.eu/schemas/dm2e/": "dm2e",
		"https://w3id.org/cwl/cwl#": "cwl",
		"http://promsns.org/def/proms#": "proms",
		"http://lsq.aksw.org/vocab#": "lsqv",
		"http://www.demcare.eu/ontologies/demlab.owl#": "demlab",
		"http://www.ontotext.com/owlim/lucene#": "luc",
		"http://ld.geojson.org/vocab#": "geojson",
		"http://guava.iis.sinica.edu.tw/r4r/": "r4r",
		"http://com.intrinsec//ontology#": "rfd",
		"http://rdaregistry.info/termList/rofrm/": "rofrm",
		"http://rdaregistry.info/termList/rofet/": "rofet",
		"https://gont.ch/": "gont",
		"http://www.aifb.uni-karlsruhe.de/WBS/uhe/ontologies#": "newsevents",
		"http://schema.vocnet.org/": "vocnet",
		"https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#": "swcomp",
		"http://www.ics.forth.gr/isl/CRMext/CRMdig.rdfs/": "crmdig",
		"http://rdaregistry.info/termList/rofit/": "rofit",
		"http://purl.org/puninj/2001/05/rgml-schema#": "rgml",
		"http://rdaregistry.info/termList/rofhf/": "rofhf",
		"http://edgarwrap.ontologycentral.com/cik/": "edgarcik",
		"http://iflastandards.info/ns/isbd/unc/elements/": "isbdu",
		"http://ontologies.semanticarts.com/gist#": "gist",
		"http://vocab.linkeddata.es/datosabiertos/def/transporte/trafico#": "estrf",
		"http://www.ontologydesignpatterns.org/ont/framenet/abox/frame/": "frame",
		"http://th-brandenburg.de/ns/itcat#": "itcat",
		"http://linkedgeodata.org/triplify/": "lgdt",
		"http://rdaregistry.info/termList/rofid/": "rofid",
		"http://datos.gob.es/sites/default/files/OntologiaDIR3/orges.owl#": "orgesv2",
		"http://vocab.ub.uni-leipzig.de/amsl/": "amsl",
		"http://purl.org/minim/minim#": "minim",
		"http://rdaregistry.info/termList/rofim/": "rofim",
		"http://www.ontologydesignpatterns.org/ont/framenet/abox/lu/": "lu",
		"http://linkedgeodata.org/meta/": "lgdm",
		"http://www.fluidops.com/": "fluidops",
		"http://rdaregistry.info/termList/rofrr/": "rofrr",
		"http://www.sdshare.org/2012/extension/": "sdshare",
		"http://datos.gob.es/def/sector-publico/organizacion#": "orges",
		"http://def.seegrid.csiro.au/ontology/om/om-lite#": "oml",
		"http://www.ontologydesignpatterns.org/ont/framenet/abox/fe/": "fe",
		"http://colin.maudry.com/ontologies/dgfr#": "dgfr",
		"http://mex.aksw.org/mex-perf#": "mexperf",
		"http://toptix.com/2010/esro/": "tix",
		"http://rdaregistry.info/termList/rofin/": "rofin",
		"https://w3id.org/valueflows/": "vf",
		"http://purl.jp/bio/11/orth#": "orth",
		"http://www.w3.org/ns/csvw#": "csvw",
		"http://w3id.org/ost/ns#": "ost",
		"http://rdaregistry.info/termList/rofrt/": "rofrt",
		"http://rdaregistry.info/termList/rofsm/": "rofsm",
		"http://auto.schema.org/": "auto",
		"http://rdaregistry.info/termList/rofsf/": "rofsf",
		"https://vocab.eccenca.com/auth/": "eccauth",
		"http://plantuml.com/ontology#": "puml",
		"http://www.openlinksw.com/schemas/oplweb#": "oplweb",
		"http://www.movieontology.org/2009/11/09/movieontology.owl#": "moo",
		"https://w3id.org/valueflows/": "valueflows",
		"http://kannel.open.ac.uk/ontology#": "door",
		"http://www.ontologydesignpatterns.org/ont/framenet/tbox/": "fntbox",
		"http://purl.org/eis/vocab/scor#": "scor",
		"http://purl.org/olia/ubyCat.owl#": "uby",
		"http://cs.dbpedia.org/": "csdbp",
		"http://ontology.cybershare.utep.edu/ELSEWeb/elseweb-modelling.owl#": "lswmo",
		"http://rdfunit.aksw.org/ns/core#": "rut",
		"http://data.foodanddrinkeurope.eu/ontology#": "efd",
		"http://eccenca.com/mobivoc/": "mv",
		"http://www.w3.org/2005/sparql-results#": "srx",
		"http://www.ontologydesignpatterns.org/ont/dul/DUL.owl#": "dul",
		"http://wikidata.dbpedia.org/resource/": "dbpw",
		"http://www.opengis.net/gml/": "gml"
};